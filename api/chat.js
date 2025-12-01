import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ✅ THE CURRICULUM (المنهج الثابت)
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
    const { data: user, error: userError } = await supabase.from('users').select('subscription_status, subscription_ends_at').eq('id', userId).single();
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
        return res.status(403).json({ error: "SUBSCRIPTION_EXPIRED" }); 
    }
    const subscriptionStatus = user?.subscription_status || 'free'; 

    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 3; 
        const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())).toISOString(); 

        const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', today).eq('role', 'user'); 
        if (count >= DAILY_LIMIT) return res.status(403).json({ error: "LIMIT_EXCEEDED" });
    }

    // 2. SAVE USER MESSAGE
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({ user_id: userId, role: 'user', content: lastMessage.content, mode: mode });
    }

    // 3. PROMPT ENGINEERING (The Soul)
    let systemPrompt = "";
    const commonRules = `
    IMPORTANT FOR TTS:
    1. Use Japanese punctuation (、 and 。) frequently.
    2. Example: "Sugoi! (すごい！)"
    3. Keep sentences short.
    `;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", a cool, energetic Japanese tutor obsessed with Anime.
      ${commonRules}
      ROLE: Friendly Rival / Senpai.
      GOAL: Free conversation. React to whatever the user says using Anime references.
      - Reply mainly in English but teach Japanese phrases.
      - Use emojis like 🎌, ⚔️, 🍥.
      `;
    } else if (mode === 'lessons') {
      const lessonData = CURRICULUM[lessonId] || { title: "Advanced", topic: "Free Talk", type: "TEACH", context: "Mastery" };
      
      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR of the ${lessonData.title}.
          ${commonRules}
          CONTEXT: ${lessonData.context}. GOAL: Test the user on: ${lessonData.topic}.
          RULES: Act strict. Ask 3 questions. Only if they pass, end with: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          ${commonRules}
          TOPIC: ${lessonData.topic}. CONTEXT: ${lessonData.context}.
          INSTRUCTIONS: Explain topic. Give sentence to translate. If correct, end with: "[LESSON_COMPLETE]".
          If wrong, explain and retry. Strict Gatekeeping.
          `;
      }
    }

    // 4. CALL AI
    const response = await fetch('[https://api.groq.com/openai/v1/chat/completions](https://api.groq.com/openai/v1/chat/completions)', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, ...messages], temperature: 0.7, max_tokens: 600 })
    })
    
    const data = await response.json()
    if (data.error) throw new Error(`Groq API Error: ${data.error.message}`);

    const aiResponseContent = data.choices[0].message.content;

    // 5. SAVE AI RESPONSE
    await supabase.from('conversations').insert({ user_id: userId, role: 'assistant', content: aiResponseContent, mode: mode, tokens_used: data.usage?.total_tokens || 0 });

    return res.status(200).json({ message: aiResponseContent })

  } catch (error) {
    console.error("🔥 FATAL API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Unknown Server Error' })
  }
}
