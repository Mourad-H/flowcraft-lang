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
  
  const { userId, tier, cycle } = req.body; // Added 'cycle' (monthly/yearly)
  if (!userId || !tier) return res.status(400).json({ error: 'Missing User ID or Tier' });

  // 💰 PRICING LOGIC (The 30% Discount Math)
  let price = 0;
  let description = "";

  if (cycle === 'yearly') {
      // 30% Discount Applied
      // Premium: $17 * 12 = $204 -> Discounted ~ $140
      // Basic: $10 * 12 = $120 -> Discounted ~ $84
      if (tier === 'premium') price = 140;
      else price = 84;
      description = `FlowCraft ${tier} (1 Year Access)`;
  } else {
      // Standard Monthly
      if (tier === 'premium') price = 17;
      else price = 10;
      description = `FlowCraft ${tier} (1 Month Access)`;
  }

  const orderId = `${userId}__${uuidv4()}__${cycle}`; // We add cycle to orderId to track it later if needed
  
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const callbackUrl = `${protocol}://${host}/api/webhooks/nowpayments`;
  const returnUrl = `${protocol}://${host}`;

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
        order_id: orderId,
        order_description: description,
        ipn_callback_url: callbackUrl,
        success_url: returnUrl,
        cancel_url: returnUrl,
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
