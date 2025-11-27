import { createClient } from '@supabase/supabase-js'

// التحقق من وجود المفاتيح قبل البدء
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, mode, userId, lessonId } = req.body

    // 1. التحقق من الاشتراك
    // ملاحظة: للتجربة السريعة، إذا كان userId غير موجود سنكمل كضيف
    if (userId) {
        const { data: user, error: dbError } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', userId)
        .single()
        
        if (dbError) console.error("Database Error:", dbError);
    }

    // 2. إعداد الـ Prompt
    let systemPrompt = "You are a helpful Japanese tutor. Teach through Anime references.";
    if (mode === 'lessons') systemPrompt += ` You are teaching Lesson ${lessonId}.`;

    console.log("Sending request to Groq..."); // Log marker

    // 3. الاتصال بـ Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    })

    const data = await response.json()

    // التحقق هل رد Groq بخطأ؟
    if (data.error) {
        throw new Error(`Groq API Error: ${data.error.message}`);
    }

    return res.status(200).json({ message: data.choices[0].message.content })

  } catch (error) {
    // 🔥 هنا التغيير المهم: طباعة الخطأ كاملاً
    console.error("🔥 FATAL API ERROR:", error);
    
    // إرسال تفاصيل الخطأ للهاتف
    return res.status(500).json({ error: error.message || 'Unknown Server Error' })
  }
}