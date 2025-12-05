import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ✅ THE CURRICULUM
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

    // 1. SUBSCRIPTION CHECK
    const { data: user } = await supabase.from('users').select('subscription_status, subscription_ends_at').eq('id', userId).single();
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
    }
    const subscriptionStatus = user?.subscription_status || 'free'; 

    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 10; 
        const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())).toISOString(); 
        const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', today).eq('role', 'user'); 
        if (count >= DAILY_LIMIT) return res.status(403).json({ error: "LIMIT_EXCEEDED" });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({ user_id: userId, role: 'user', content: lastMessage.content, mode: mode });
    }

    // 2. PROMPT ENGINEERING (UNIFIED & FIXED) 🔧
    let systemPrompt = "";
    
    // قواعد الصوت العامة
    const commonRules = `
    AUDIO RULES: Use Japanese punctuation (、 。) for pauses within Japanese text.
    `;

    // ✅ التنسيق الموحد الصارم (يحل مشكلة الالتصاق)
    // نضع فاصلة "," بعد القوس لكي يتوقف الصوت قليلاً
    const STRICT_FORMAT_RULES = `
    🛑 STRICT FORMATTING (FOLLOW EXACTLY):
    1. Wrap Japanese script (Kanji/Kana) in double curly braces: {{ 日本語 }}
    2. ALWAYS put a COMMA after the closing brace, then the Romaji in brackets.
    3. CORRECT FORMAT: {{ 日本語 }} , (Romaji)
    4. Example: "Say {{ こんにちは }} , (Konnichiwa)."
    5. NEVER put English/Romaji inside the {{ }} brackets.
    `;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", an Anime Japanese tutor.
      ${commonRules}
      ROLE: Friendly Rival / Senpai.
      GOAL: Chat about anime while teaching.
      
      ${STRICT_FORMAT_RULES}
      
      🛑 CRITICAL RULE FOR CHAT:
      1. Inside {{ double braces }}, you must ONLY use Japanese characters (Kanji/Kana).
      2. NEVER write English letters or Romaji inside {{ }}.
      3. WRONG: "{{ Arigatou }} , (Arigatou)"
      4. RIGHT: "{{ ありがとう }} , (Arigatou)"
      
      - Reply mainly in English but mix in Japanese phrases naturally using the format above.
      `;
    }
    else if (mode === 'lessons') {
      const lessonData = CURRICULUM[lessonId] || { title: "Advanced", topic: "Free Talk", type: "TEACH", context: "Mastery" };
      
      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR.
          ${commonRules}
          ${STRICT_FORMAT_RULES}
          CONTEXT: ${lessonData.context}. GOAL: Test on ${lessonData.topic}.
          RULES: Ask 3 questions. Use the format above. If pass: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          ${commonRules}
          ${STRICT_FORMAT_RULES}
          TOPIC: ${lessonData.topic}.
          INSTRUCTIONS: Explain topic. Give examples using: {{ Kanji }} , (Romaji).
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
