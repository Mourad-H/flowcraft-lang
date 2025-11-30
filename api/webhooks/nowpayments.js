import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto'; // ضروري للتحقق من الأمان

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;
    const signature = req.headers['x-api-signature'];
    const payload = JSON.stringify(req.body);
    
    // 1. التحقق من التوقيع (تنفيذ التعليقات القديمة فعلياً)
    if (IPN_SECRET) {
        const hash = crypto.createHmac('sha512', IPN_SECRET).update(payload).digest('hex');
        if (signature && signature !== hash) {
            console.error('Security Alert: Invalid Signature');
            return res.status(401).json({ status: 'Invalid Signature' });
        }
    }

    // استخراج البيانات
    const { payment_status, order_id } = req.body;
    
    // 🛑 التغيير الجوهري هنا: استخراج User ID من order_id بدلاً من extra
    // الكود القديم: const passedUserId = req.body.extra; (هذا سيفشل الآن)
    // الكود الجديد:
    const passedUserId = order_id ? order_id.split('__')[0] : null;

    if (!passedUserId) {
        console.error("Webhook Error: No User ID found in order_id");
        // لا نوقف العملية بـ 400 لكي لا يعيد NowPayments الإرسال، فقط نسجل الخطأ
        return res.status(200).json({ error: "Invalid Order Format" });
    }

    // 2. تفعيل الاشتراك عند النجاح
    if (payment_status === 'finished') {
      const { error } = await supabaseAdmin.from('users')
        .update({ 
            subscription_status: 'active', 
            subscription_tier: 'premium',
            // حافظنا على منطق التاريخ من كودك القديم ✅
            subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', passedUserId);

      if (error) {
        console.error('Supabase Update Error:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log(`✅ User ${passedUserId} Activated via NowPayments`);
      return res.status(200).json({ status: 'user activated' });
    }

    // التعامل مع الحالات الأخرى
    return res.status(200).json({ status: `Payment status: ${payment_status}` });

  } catch (error) {
    console.error('Webhook Runtime Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
