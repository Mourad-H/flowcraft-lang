import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { userId, tier } = req.body;
  if (!userId || !tier) return res.status(400).json({ error: 'Missing User ID or Tier' });

  const price = tier === 'premium' ? 17 : 10;
  const orderId = uuidv4();
  
  // تحسين بناء الروابط لضمان البروتوكول الصحيح (https)
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  
  const callbackUrl = `${protocol}://${host}/api/webhooks/nowpayments`;
  const returnUrl = `${protocol}://${host}`; // العودة للصفحة الرئيسية

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
        // 🛑 حذفنا pay_currency: 'usdc' للسماح للمستخدم باختيار العملة
        order_id: orderId,
        order_description: `FlowCraft ${tier} subscription`, // وصف يظهر في الفاتورة
        ipn_callback_url: callbackUrl,
        success_url: returnUrl,
        cancel_url: returnUrl,
        
        // ✅ هذا هو الجزء الأهم الذي كان ناقصاً في الكود القديم:
        // نمرر الـ ID هنا ليعود إلينا في الـ Webhook ونعرف من قام بالدفع
        extra: {
            userId: userId 
        }
      })
    });

    const data = await response.json();
    
    if (data.id && data.invoice_url) {
      return res.status(200).json({ invoice_url: data.invoice_url });
    } else {
      console.error("NowPayments Error:", data);
      throw new Error(data.message || 'NowPayments API failure');
    }

  } catch (error) {
    console.error('Invoice Creation Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
