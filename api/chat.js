import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ✅ المنهج الدراسي (لا تحذفه)
const CURRICULUM = {
    1: { title: "The First Meeting", topic: "Basic Greetings (Ohayou, Konnichiwa)", context: "Anime School Life", type: "TEACH" },
    2: { title: "Who Am I?", topic: "Self Introduction (Watashi wa... desu)", context: "Shonen Protagonist Intro", type: "TEACH" },
    3: { title: "Yes, No, Maybe", topic: "Hai, Iie, and basic agreement", context: "Detective Anime Interrogation", type: "TEACH" },
    4: { title: "Review & Practice", topic: "Review of Lessons 1-3", context: "Training Montage", type: "TEACH" },
    5: { title: "GENIN EXAM", topic: "Test on Lessons 1-4", context: "Chunin Exam Arena", type: "EXAM" },
    6: { title: "The Object", topic: "Kore, Sore, Are (This, That)", context: "Shopping in Akihabara", type: "TEACH" },
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

    // 1. SUBSCRIPTION & LIMITS (منطق الـ 10 رسائل المجانية)
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

    // 🛑 3. PROMPT ENGINEERING (الحل الموحد) 🛑
    let systemPrompt = "";
    
    // هذه القواعد ستطبق على الشات والدروس معاً لمنع اللخبطة
    const SHARED_RULES = `
    CRITICAL OUTPUT RULES:
    1. ALWAYS use Japanese Script (Kanji/Kana) for Japanese words.
    2. WRAP all Japanese Script inside double curly braces: {{ 日本語 }}.
    3. Put the Romaji reading next to it in standard parentheses: (Romaji).
    4. CORRECT FORMAT: "The word is {{ こんにちは }} (Konnichiwa)."
    5. NEVER put Romaji inside {{ }}.
    6. NEVER write Japanese without {{ }}.
    `;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", an Anime Japanese tutor.
      ROLE: Friendly Rival / Senpai.
      GOAL: Chat freely about anime.
      
      ${SHARED_RULES}
      
      - Reply mainly in English but mix in Japanese phrases using the format above.
      - Use emojis like 🎌, ⚔️.
      `;
    } 
    else if (mode === 'lessons') {
      const lessonData = CURRICULUM[lessonId] || { title: "Advanced", topic: "Free Talk", type: "TEACH", context: "Mastery" };
      
      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR.
          CONTEXT: ${lessonData.context}. GOAL: Test on ${lessonData.topic}.
          
          ${SHARED_RULES}
          
          RULES: Ask 3 questions. If pass: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          TOPIC: ${lessonData.topic}.
          
          ${SHARED_RULES}
          
          INSTRUCTIONS: Explain topic. Give examples using the format above.
          GATEKEEPING: If correct, end with: "[LESSON_COMPLETE]".
          `;
      }
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, ...messages], temperature: 0.7, max_tokens: 600 })
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
