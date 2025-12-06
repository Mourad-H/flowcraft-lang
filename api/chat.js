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
      const lessonData = getLessonData(lessonId);
      
      // ✅ FORCE-FEED THE CONTENT
      // We take the 'content' array from the JSON and turn it into a string
      // The AI MUST use this.
      const contentBlock = lessonData.content 
        ? `SOURCE MATERIAL (TEACH THIS ONLY):\n${lessonData.content.join("\n")}` 
        : "No specific source material. Generate basic examples.";

      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR.
          CONTEXT: ${lessonData.context}.
          ${STRICT_FORMAT}
          
          ${contentBlock}
          
          RULES: 
          - Ask 3 questions based ONLY on the SOURCE MATERIAL above.
          - If pass: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          TOPIC: ${lessonData.topic}.
          
          ${STRICT_FORMAT}
          
          ${contentBlock}
          
          INSTRUCTIONS: 
          1. Present the SOURCE MATERIAL clearly to the user.
          2. Explain the meaning briefly in English.
          3. Ask them to practice/repeat one phrase.
          4. STRICT GATEKEEPING: If correct, end with: "[LESSON_COMPLETE]".
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
