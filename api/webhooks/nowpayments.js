import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import fetch from 'node-fetch'; // تأكد أنك ثبتت هذه المكتبة سابقاً

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// دالة مساعدة لإرسال إشعار تيليجرام
async function sendTelegramAlert(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown' // لتنسيق النص بشكل جميل
      })
    });
  } catch (error) {
    console.error('Telegram Alert Failed:', error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;
    const signature = req.headers['x-api-signature'];
    const payload = JSON.stringify(req.body);
    
    // 1. التحقق من التوقيع
    if (IPN_SECRET) {
        const hash = crypto.createHmac('sha512', IPN_SECRET).update(payload).digest('hex');
        if (signature && signature !== hash) {
            console.error('Security Alert: Invalid Signature');
            return res.status(401).json({ status: 'Invalid Signature' });
        }
    }

    const { payment_status, order_id, pay_amount, pay_currency } = req.body;
    const passedUserId = order_id ? order_id.split('__')[0] : null;

    if (!passedUserId) {
        console.error("Webhook Error: No User ID found");
        return res.status(200).json({ error: "Invalid Order Format" });
    }

    // 2. تفعيل الاشتراك عند النجاح
    if (payment_status === 'finished') {
      const { error } = await supabaseAdmin.from('users')
        .update({ 
            subscription_status: 'active', 
            subscription_tier: 'premium',
            subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', passedUserId);

      if (error) {
        console.error('Supabase Update Error:', error);
        // نرسل تنبيه فشل لنقوم بالتفعيل اليدوي
        await sendTelegramAlert(`🚨 **ERROR!** Payment received but DB update failed!\nUser: \`${passedUserId}\`\nAmount: ${pay_amount} ${pay_currency}`);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log(`✅ User ${passedUserId} Activated`);
      
      // 🔔 إرسال إشعار النجاح لهاتفك!
      await sendTelegramAlert(`💰 **KA-CHING! New Sale!**\n\nUser: \`${passedUserId}\`\nAmount: **${pay_amount} ${pay_currency.toUpperCase()}**\nStatus: Active ✅`);
      
      return res.status(200).json({ status: 'user activated' });
    }
    
    // تنبيه للحالات المعلقة (اختياري)
    if (payment_status === 'waiting') {
        console.log(`⏳ Payment waiting for user: ${passedUserId}`);
    }

    return res.status(200).json({ status: `Payment status: ${payment_status}` });

  } catch (error) {
    console.error('Webhook Runtime Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
