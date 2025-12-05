import { createClient } from '@supabase/supabase-js'

// استيراد المكتبة الضخمة
import { FULL_CURRICULUM } from '../data/curriculumData.js'; // تأكد من المسار الصحيح


if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)


// دالة البحث في المكتبة الضخمة
const getLesson = (id) => {
    // 1. البحث في الـ 500 درس الجاهزة
    if (FULL_CURRICULUM[id]) return FULL_CURRICULUM[id];
    
    // 2. إذا انتهت الـ 500 (للمستقبل البعيد)، ولد درس عشوائي
    if (id % 5 === 0) {
        return { title: `Rank S Exam (Level ${id})`, topic: `Mastery Test`, context: "Kage Level", type: "EXAM" };
    }
    return { title: `Level ${id} Training`, topic: "Advanced Immersion", context: "Infinite Arc", type: "TEACH" };
};


export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, mode, userId, lessonId } = req.body

    if (!userId) return res.status(401).json({ error: "USER_ID_MISSING" });

    // --- 2. SUBSCRIPTION & LIMITS (10 Messages) ---
    const { data: user } = await supabase.from('users').select('subscription_status, subscription_ends_at').eq('id', userId).single();
    
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
    }
    
    const subscriptionStatus = user?.subscription_status || 'free'; 

    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 10; // ✅ 10 رسائل
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString(); 

        const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', today).eq('role', 'user'); 
        
        if (count >= DAILY_LIMIT) return res.status(403).json({ error: "LIMIT_EXCEEDED" });
    }

    // --- 3. LOGGING ---
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({ user_id: userId, role: 'user', content: lastMessage.content, mode: mode });
    }

    // --- 4. PROMPT ENGINEERING (STRICT & UNIFIED) ---
    let systemPrompt = "";
    let aiTemperature = 0.7; // القيمة الافتراضية
    let maxTokens = 600;     // القيمة الافتراضية

    // 🟢 1. مود الدردشة (الذكاء الأقصى والحرية)
    if (mode === 'chat') {
        aiTemperature = 0.8; // رفعنا الحرارة للإبداع
        maxTokens = 1000;    // زدنا المساحة لردود أطول وأمتع
        
        systemPrompt = `
        IDENTITY: You are "FlowSensei", a fun, energetic Anime Otaku companion.
        GOAL: Engage in endless, immersive roleplay conversations about anime, life, and Japan.
        
        RULES:
        1. Use slang, emojis (🎌, 🔥), and anime references constantly.
        2. Be a "Friendly Rival" - challenge the user playfully.
        3. Correct their Japanese mistakes GENTLY, then continue the chat.
        4. ALWAYS wrap Japanese words in {{ }} as per the strict format rules.
        `;
    } 
    
    // 🔴 2. مود الدروس (الذكاء المحدود - وضع "المصحح الآلي")
    else if (mode === 'lessons') {
        const lessonData = CURRICULUM[lessonId]; // جلب البيانات من المكتبة الثابتة
        aiTemperature = 0.1; // حرارة منخفضة جداً للدقة والصرامة
        maxTokens = 300;     // تقليل التوكنات لأننا لا نحتاج شرحاً طويلاً
        
        // هنا الـ AI لا يشرح، بل يختبر فقط لأن الشرح موجود في الواجهة
        systemPrompt = `
        TASK: You are an automated EXAMINER for Lesson ${lessonId}.
        TOPIC: ${lessonData.topic}.
        CONTEXT: ${lessonData.context}.
        
        YOUR JOB:
        The user will send a sentence attempting to use the lesson's grammar/vocabulary.
        1. Check if their Japanese is grammatically correct based on the Topic.
        2. If CORRECT: Say "Perfect!" and output tag: "[LESSON_COMPLETE]".
        3. If WRONG: Briefly explain the error (1 sentence) and ask them to try again.
        
        DO NOT explain the lesson from scratch. Assume they read the library content.
        STRICT FORMATTING: Use {{ Kanji }} (Romaji) for all corrections.
        `;
    }

    // 3. الاتصال بـ Groq (مع المتغيرات الجديدة)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          model: 'llama-3.3-70b-versatile', 
          messages: [{ role: 'system', content: systemPrompt }, ...messages], 
          temperature: aiTemperature, // ✅ متغير حسب المود
          max_tokens: maxTokens       // ✅ متغير حسب المود
      })
    })
    
    const data = await response.json()
    if (data.error) throw new Error(`Groq API Error: ${data.error.message}`);

    const aiResponseContent = data.choices[0].message.content;

    // --- 6. SAVE RESPONSE ---
    await supabase.from('conversations').insert({ user_id: userId, role: 'assistant', content: aiResponseContent, mode: mode, tokens_used: data.usage?.total_tokens || 0 });

    return res.status(200).json({ message: aiResponseContent })

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Server Error' })
  }
}
