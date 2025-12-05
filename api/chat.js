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
    
    // ✅ تعريف القواعد العامة (لتفادي خطأ undefined)
    const commonRules = `
    AUDIO RULES: Use Japanese punctuation (、 。) for pauses within Japanese text.
    `;

    // ✅ الدستور الصارم للكتابة (يطبق على الشات والدروس)
    const STRICT_FORMAT = `
    🛑 CRITICAL FORMATTING RULES (DO NOT IGNORE):
    1. Inside the double brackets {{ }}, you must WRITE ONLY JAPANESE SCRIPT (Kanji/Kana).
    2. NEVER write Romaji or English inside {{ }}.
    3. Romaji must go OUTSIDE and AFTER the brackets in parentheses.
    
    ✅ CORRECT: "{{ こんにちは }} (Konnichiwa)"
    ❌ WRONG: "{{ Konnichiwa }}"
    ❌ WRONG: "{{ Konnichiwa (Hello) }}"
    
    If you break this rule, the audio engine will fail.
    `;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", an Anime Japanese tutor.
      ${commonRules}
      ${STRICT_FORMAT}
      
      ROLE: Friendly Rival / Senpai.
      GOAL: Chat about anime while teaching.
      
      - Reply mainly in English but mix in Japanese phrases naturally using the format above.
      - Use emojis like 🎌, ⚔️, 🍥.
      `;
    } 
    // ✅ استخدام دالة getLesson لدعم 100 درس
    else if (mode === 'lessons') {
      const lessonData = getLesson(lessonId);
      
      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR of the ${lessonData.title}.
          ${commonRules}
          ${STRICT_FORMAT}
          
          CONTEXT: ${lessonData.context}. 
          GOAL: Test the user on: ${lessonData.topic}.
          
          RULES: 
          - Ask 3 distinct questions one by one.
          - Only if they pass all 3, end with: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          ${commonRules}
          ${STRICT_FORMAT}
          
          TOPIC: ${lessonData.topic}.
          INSTRUCTIONS: 
          - Explain topic clearly.
          - Give examples using the strict format: {{ Kanji }} (Romaji).
          - STRICT GATEKEEPING: If correct, say "Correct!" and IMMEDIATELY end with: "[LESSON_COMPLETE]".
          `;
      }
    }

    // --- 5. CALL AI ---
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, ...messages], temperature: 0.8, max_tokens: 600 })
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
