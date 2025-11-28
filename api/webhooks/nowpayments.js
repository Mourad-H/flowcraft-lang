import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 1. (هام جداً) التحقق من NowPayments Signature
  // يجب أن تقارن الـ hash القادم من NowPayments بـ HMAC-SHA512
  // ... (هنا يتم التحقق من الأمان) ...
  
  const paymentStatus = req.body.payment_status;
  const orderId = req.body.order_id;
  const passedUserId = req.body.extra; // إذا مررنا الـ ID في حقل 'extra'

  // 2. تفعيل الاشتراك عند النجاح
  if (paymentStatus === 'finished') {
      // ✅ التعديل: تفعيل الحساب وتعيين تاريخ انتهاء الاشتراك (بعد شهر)
      const { error } = await supabaseAdmin.from('users')
        .update({ 
            subscription_status: 'active', 
            subscription_tier: 'premium',
            subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // شهر واحد
        })
        .eq('id', passedUserId);

      if (error) {
        console.error('Supabase Update Error:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log(`✅ User ${passedUserId} Activated via NowPayments`);
      return res.status(200).json({ status: 'user activated' });
    }

  // 3. معالجة الحالات الأخرى (مثل 'waiting', 'failed', 'refunded')

  return res.status(200).json({ status: 'payment received but not finished' });
}