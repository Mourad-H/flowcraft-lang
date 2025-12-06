import { createClient } from '@supabase/supabase-js'
import { FULL_CURRICULUM } from '../data/curriculumData.js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// دالة جلب الدرس
const getLessonData = (id) => {
    if (FULL_CURRICULUM && FULL_CURRICULUM[id]) return FULL_CURRICULUM[id];
    if (id % 5 === 0) return { title: `Rank Exam (Level ${id})`, topic: `Mastery Review`, context: "Advanced Trial", type: "EXAM" };
    return { title: `Level ${id} Training`, topic: "Advanced Conversation", context: "Anime World Scenario", type: "TEACH" };
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, mode, userId, lessonId } = req.body
    if (!userId) return res.status(401).json({ error: "USER_ID_MISSING" });

    // 1. SUBSCRIPTION & LIMITS
    const { data: user } = await supabase.from('users').select('subscription_status, subscription_ends_at').eq('id', userId).single();
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
    }
    const subscriptionStatus = user?.subscription_status || 'free'; 

    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 10; 
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString(); 
        const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', today).eq('role', 'user'); 
        if (count >= DAILY_LIMIT) return res.status(403).json({ error: "LIMIT_EXCEEDED" });
    }

    // 2. LOGGING
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({ user_id: userId, role: 'user', content: lastMessage.content, mode: mode });
    }

    // 3. PROMPT ENGINEERING
    let systemPrompt = "";
    let aiTemperature = 0.7; // افتراضي

    const commonRules = `AUDIO RULES: Use Japanese punctuation (、 。) for pauses.`;

    const STRICT_FORMAT = `
    🛑 FORMATTING RULES:
    1. WRAP Japanese script in {{ }}: {{ こんにちは }}
    2. Put Romaji after in ( ): (Konnichiwa)
    3. NO English/Romaji inside {{ }}.
    `;

    if (mode === 'chat') {
      aiTemperature = 0.8; // 🔥 حرارة عالية للإبداع في الشات
      systemPrompt = `You are "FlowSensei", an Anime Japanese tutor.
      ROLE: Friendly Rival / Senpai.
      GOAL: Chat freely about anime.
      ${STRICT_FORMAT}
      - Use Japanese phrases naturally.
      - Use emojis: 🎌, ⚔️, 🍥.
      `;
    } 
    else if (mode === 'lessons') {
      aiTemperature = 0.2; // 🧊 حرارة منخفضة جداً للانضباط في الدروس
      const lessonData = getLessonData(lessonId);
      const contentBlock = lessonData.content ? `LESSON CONTENT:\n${lessonData.content.join("\n")}` : "";

      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR.
          CONTEXT: ${lessonData.context}. GOAL: Test on ${lessonData.topic}.
          ${STRICT_FORMAT}
          ${contentBlock}
          
          RULES: 
          1. Ask 3 questions based on content.
          2. IF PASS: Write EXACTLY: "[EXAM_PASSED]" and stop.
          3. DO NOT write summaries or congratulations speeches.
          4. DO NOT invent new tags.
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          TOPIC: ${lessonData.topic}.
          ${STRICT_FORMAT}
          ${contentBlock}
          
          INSTRUCTIONS: 
          1. Teach using the provided content. 
          2. STRICT GATEKEEPING: 
             - Check user answer.
             - If CORRECT: Say "Correct!" and write EXACTLY: "[LESSON_COMPLETE]".
             - DO NOT write anything else after the tag.
             - DO NOT give a speech.
          `;
      }
    }

    // 4. CALL AI
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          model: 'llama-3.3-70b-versatile', 
          messages: [{ role: 'system', content: systemPrompt }, ...messages], 
          temperature: aiTemperature, // ✅ استخدام الحرارة المتغيرة
          max_tokens: 600 
      })
    })
    
    const data = await response.json()
    if (data.error) throw new Error(`Groq API Error: ${data.error.message}`);
    const aiResponseContent = data.choices[0].message.content;

    await supabase.from('conversations').insert({ user_id: userId, role: 'assistant', content: aiResponseContent, mode: mode, tokens_used: data.usage?.total_tokens || 0 });

    return res.status(200).json({ message: aiResponseContent })

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Server Error' })
  }
}
