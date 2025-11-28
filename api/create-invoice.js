import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch'; // يجب تثبيت node-fetch إذا لم يكن لديك
import { v4 as uuidv4 } from 'uuid'; // نحتاج لتوليد ID فريد

// إعداد Supabase
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// يجب إضافة مفتاح NowPayments لـ Vercel
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { userId, tier } = req.body;
  if (!userId || !tier) return res.status(400).json({ error: 'Missing User ID or Tier' });

  // تحديد السعر والعملة المستهدفة
  const price = tier === 'premium' ? 17 : 10;
  const orderId = uuidv4(); // توليد رقم طلب فريد
  
  const callbackUrl = `https://${req.headers.host}/api/webhooks/nowpayments`;

  try {
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'X-Api-Key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: price,
        price_currency: 'usd',
        pay_currency: 'usdc', // الزبون سيدفع بـ USDT
        order_id: orderId,
        ipn_callback_url: callbackUrl, // رابط Webhook
        // تمرير الـ User ID سراً في حقل الـ 'extra'
        // هذا الرابط سيعود إلينا في الـ Webhook
        success_url: `https://${req.headers.host}/welcome?status=success`, 
        // نحتاج لتسجيل الطلب في قاعدة البيانات أولاً
        // ... (منطق حفظ الطلب في جدول مؤقت) ...
      })
    });

    const data = await response.json();
    
    if (data.id) {
      // إرسال رابط الدفع للفرونت-إند
      return res.status(200).json({ invoice_url: data.invoice_url });
    } else {
      throw new Error(data.message || 'NowPayments API failure');
    }

  } catch (error) {
    console.error('Invoice Creation Error:', error);
    return res.status(500).json({ error: error.message });
  }
}