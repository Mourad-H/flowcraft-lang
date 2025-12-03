import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// دالة إرسال الإشعار لتيليجرام (نفس التي استخدمناها سابقاً)
async function sendTelegramAlert(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
    });
  } catch (e) { console.error('Telegram Error:', e); }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const event = req.body;

    // التحقق من نوع الحدث (دفع ناجح)
    if (event.action === 'payment.succeeded' || event.action === 'membership.went_active') {
        
        // Whop يرسل البيانات داخل هيكل معين
        const userEmail = event.data?.user?.email || event.data?.email;
        const productName = event.data?.product?.name || "Premium";
        const amount = event.data?.final_amount || "Unknown";

        if (!userEmail) {
            console.error("No email found in Whop webhook");
            return res.status(400).json({ error: "No email found" });
        }

        // تحديد المستوى
        let tier = 'premium'; 
        if (productName.toLowerCase().includes('chat')) tier = 'chat';
        if (productName.toLowerCase().includes('lesson')) tier = 'lessons';

        // تحديث قاعدة البيانات
        const { error } = await supabaseAdmin
            .from('users')
            .update({ 
                subscription_status: 'active',
                subscription_tier: tier,
                subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('email', userEmail);

        if (error) {
            await sendTelegramAlert(`🚨 **WHOP ERROR!** Paid but DB failed.\nUser: ${userEmail}`);
            throw error;
        }

        // إشعار النجاح
        console.log(`✅ User ${userEmail} upgraded via Whop`);
        await sendTelegramAlert(`💳 **WHOP SALE!** (Card Payment)\n\nUser: \`${userEmail}\`\nPlan: **${tier.toUpperCase()}**\nAmount: **$${amount}**\nStatus: Active ✅`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Whop Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
