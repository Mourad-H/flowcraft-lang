import { createClient } from '@supabase/supabase-js'
import { FULL_CURRICULUM } from '../data/curriculumData.js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// Helper to get lesson
const getLessonData = (id) => {
    if (FULL_CURRICULUM && FULL_CURRICULUM[id]) return FULL_CURRICULUM[id];
    if (id % 5 === 0) return { title: `Rank Exam (Level ${id})`, topic: `Mastery Review`, context: "Advanced Trial", type: "EXAM" };
    return { title: `Level ${id} Training`, topic: "Advanced Conversation", context: "Anime World Scenario", type: "TEACH" };
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, mode, userId, lessonId } = req.body
    if (!userId) return res.status(401).json({ error: "USER_ID_MISSING" });

    // 1. SUBSCRIPTION CHECK
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

    // 3. SUPER SOLDIER PROMPTS 🧠
    let systemPrompt = "";
    
    // DeepSeek loves explicit, logical rules.
    const STRICT_FORMAT = `
    [SYSTEM MANDATE]:
    1. You MUST include Japanese text in every response.
    2. Japanese text MUST be written in native script (Kanji/Kana).
    3. Japanese text MUST be wrapped in {{ }} braces.
    4. Romaji MUST be in ( ) parentheses OUTSIDE the braces.
    
    CORRECT PATTERN: "Hello is {{ こんにちは }} (Konnichiwa)."
    FAILURE PATTERN: "Hello is Konnichiwa."
    `;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei".
      ${STRICT_FORMAT}
      ROLE: Friendly Anime Rival.
      GOAL: Chat fun.
      - Reply in English but inject Japanese using the PATTERN above.
      - Use emojis: 🎌, ⚔️.
      `;
    } 
    else if (mode === 'lessons') {
      const lessonData = getLessonData(lessonId);
      const contentBlock = lessonData.content ? `SOURCE MATERIAL:\n${lessonData.content.join("\n")}` : "";

      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR.
          ${STRICT_FORMAT}
          ${contentBlock}
          TASK: Ask 3 questions based on SOURCE MATERIAL.
          PASS CONDITION: If user answers 3 correctly, output ONLY: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei. Lesson: ${lessonData.title}.
          ${STRICT_FORMAT}
          ${contentBlock}
          TASK: Teach the SOURCE MATERIAL.
          GATEKEEPING: Ask user to repeat/translate. If correct, output ONLY: "[LESSON_COMPLETE]".
          `;
      }
    }

    // 4. CALL MIXTRAL (THE SUPER SOLDIER) ⚔️
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          // 🛑 SWAPPING MODEL TO MIXTRAL
          model: 'model: 'mixtral-8x7b-32768',
          messages: [{ role: 'system', content: systemPrompt }, ...messages], 
          temperature: 0.6, // DeepSeek handles logic better even at 0.6
          max_tokens: 1000 
      })
    })
    
    const data = await response.json()
    if (data.error) throw new Error(`Groq API Error: ${data.error.message}`);
    
    let aiResponseContent = data.choices[0].message.content;

    // 🛑 CLEANING THE BRAIN (Removing <think> tags)
    // DeepSeek outputs its thoughts in <think> tags. We must hide them from the user.
    aiResponseContent = aiResponseContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    // 5. SAVE RESPONSE
    await supabase.from('conversations').insert({ user_id: userId, role: 'assistant', content: aiResponseContent, mode: mode, tokens_used: data.usage?.total_tokens || 0 });

    return res.status(200).json({ message: aiResponseContent })

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Server Error' })
  }
}
