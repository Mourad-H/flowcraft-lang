import { createClient } from '@supabase/supabase-js'

// ✅ Import the Real Curriculum
import { FULL_CURRICULUM } from '../data/curriculumData.js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ✅ Robust Lesson Getter
const getLessonData = (id) => {
    if (FULL_CURRICULUM && FULL_CURRICULUM[id]) {
        return FULL_CURRICULUM[id];
    }
    // Fallback generator only if ID > 500
    if (id % 5 === 0) return { title: `Rank Exam (Level ${id})`, topic: `Mastery Review`, context: "Advanced Trial", type: "EXAM" };
    return { title: `Level ${id} Training`, topic: "Advanced Conversation", context: "Anime World Scenario", type: "TEACH" };
};

export default async function handler(req, res) {
  // ... (Keep your existing CORS and Method checks here) ...
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, mode, userId, lessonId } = req.body
    if (!userId) return res.status(401).json({ error: "USER_ID_MISSING" });

    // ... (Keep Subscription/Limit logic here) ...
    const { data: user } = await supabase.from('users').select('subscription_status, subscription_ends_at').eq('id', userId).single();
    const subscriptionStatus = user?.subscription_status || 'free'; 
    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 10; 
        const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())).toISOString(); 
        const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', today).eq('role', 'user'); 
        if (count >= DAILY_LIMIT) return res.status(403).json({ error: "LIMIT_EXCEEDED" });
    }

    // ... (Keep Logging logic here) ...
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({ user_id: userId, role: 'user', content: lastMessage.content, mode: mode });
    }

    // 🛑 THE FIX: PROMPT ENGINEERING 🛑
    let systemPrompt = "";
    
    // Rules for Japanese formatting
    const STRICT_FORMAT = `
    🛑 CRITICAL RULES:
    1. Use Japanese Script (Kanji/Kana) inside {{ }}.
    2. Romaji goes outside in ( ).
    3. Example: "{{ こんにちは }} (Konnichiwa)"
    `;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", an Anime Japanese tutor.
      ROLE: Friendly Rival. GOAL: Chat freely.
      ${STRICT_FORMAT}
      - Reply in English but mix in Japanese phrases.
      `;
    } 
            else if (mode === 'lessons') {
      const lessonData = getLessonData(lessonId); // دالة جلب الدرس من الملف
      
      // 1. استخراج المحتوى المكتوب في الملف (وليس توليده)
      // إذا كان الدرس يحتوي على "content" في الملف، سنستخدمه.
      // إذا لم يكن يحتوي (درس مستقبلي)، سنطلب من الـ AI التوليد كخطة بديلة.
      
      const hasHardcodedContent = lessonData.content && Array.isArray(lessonData.content);
      
      const contentBlock = hasHardcodedContent
        ? `🛑 MANDATORY SOURCE MATERIAL (READ ONLY):
${lessonData.content.join("\n")}
------------------------------------------------` 
        : `⚠️ NO DATA IN LIBRARY. Generate 3 examples for "${lessonData.topic}" using STRICT format: {{ Kanji }} (Romaji).`;

      // 2. التعليمات الصارمة (للامتحان والتدريس)
      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR.
          CONTEXT: ${lessonData.context}. 
          GOAL: Test on ${lessonData.topic}.
          
          ${contentBlock}
          
          RULES: 
          1. Ask questions based DIRECTLY on the "MANDATORY SOURCE MATERIAL" above.
          2. Do NOT invent new words. Test them on what is listed above.
          3. Use the exact Japanese formatting provided in the material.
          4. If pass: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          TOPIC: ${lessonData.topic}.
          
          ${contentBlock}
          
          INSTRUCTIONS (FOLLOW ORDER): 
          1. Start by DISPLAYING the "MANDATORY SOURCE MATERIAL" list above to the user exactly as written.
          2. Do NOT summarize it. Do NOT translate it differently. Copy-paste the Japanese parts.
          3. After showing the list, explain the grammar briefly in English.
          4. Ask the user to type one of the phrases.
          5. STRICT GATEKEEPING: If they type it correctly, end with: "[LESSON_COMPLETE]".
          `;
      }
    }



    // Call AI
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          model: 'llama-3.3-70b-versatile', 
          messages: [{ role: 'system', content: systemPrompt }, ...messages], 
          temperature: 0.3, // Keep it strict for lessons
          max_tokens: 600 
      })
    })
    
    const data = await response.json()
    const aiResponseContent = data.choices[0].message.content;

    await supabase.from('conversations').insert({ user_id: userId, role: 'assistant', content: aiResponseContent, mode: mode, tokens_used: data.usage?.total_tokens || 0 });

    return res.status(200).json({ message: aiResponseContent })

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Server Error' })
  }
}
