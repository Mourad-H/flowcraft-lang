import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ============================================================
// 1. THE CURRICULUM (المنهج الأساسي + المولد التلقائي)
// ============================================================
const BASE_CURRICULUM = {
    // --- ARC 1: THE GENIN BEGINNINGS ---
    1: { title: "The First Meeting", topic: "Basic Greetings (Ohayou, Konnichiwa)", context: "Anime School Life", type: "TEACH" },
    2: { title: "Who Am I?", topic: "Self Introduction (Watashi wa... desu)", context: "Shonen Protagonist Intro", type: "TEACH" },
    3: { title: "Yes, No, Maybe", topic: "Hai, Iie, and basic agreement", context: "Detective Anime Interrogation", type: "TEACH" },
    4: { title: "Review & Practice", topic: "Review of Lessons 1-3", context: "Training Montage", type: "TEACH" },
    5: { title: "GENIN EXAM", topic: "Test on Lessons 1-4", context: "Chunin Exam Arena", type: "EXAM" },
    
    // --- ARC 2: SCHOOL LIFE ---
    6: { title: "The Object", topic: "Kore, Sore, Are (This, That)", context: "Shopping in Akihabara", type: "TEACH" },
    7: { title: "Existence", topic: "Imasu / Arimasu (Living vs Non-living)", context: "Searching for a villain", type: "TEACH" },
    8: { title: "School Titles", topic: "Senpai, Kouhai, Sensei", context: "High School Drama", type: "TEACH" },
    9: { title: "Time", topic: "Ima nanji desu ka?", context: "Running late for school", type: "TEACH" },
    10: { title: "Midterms", topic: "Review Lessons 6-9", context: "School Midterm Exams", type: "EXAM" },

    // --- ARC 3: BATTLE MODE ---
    11: { title: "Power Verbs", topic: "Taberu, Iku, Tatakau (Dict form)", context: "Planning a battle", type: "TEACH" },
    12: { title: "Destinations", topic: "Particle 'Ni' (To go to...)", context: "Heading to the dungeon", type: "TEACH" },
    13: { title: "Objects of Action", topic: "Particle 'O' (Eat ramen)", context: "Naruto eating Ichiraku Ramen", type: "TEACH" },
    14: { title: "Command Form", topic: "Nigero! Yame! (Run/Stop)", context: "Giving orders in battle", type: "TEACH" },
    15: { title: "Chunin Exam", topic: "Review Lessons 11-14", context: "Forest of Death", type: "EXAM" },
};

// ✅ دالة ذكية لتوليد الدروس حتى 100+ إذا لم تكن في القائمة
const getLesson = (id) => {
    if (BASE_CURRICULUM[id]) return BASE_CURRICULUM[id];
    
    // توليد تلقائي للمستويات المتقدمة
    if (id % 5 === 0) {
        return { title: `Rank ${id} Exam`, topic: `Mastery Test for Level ${id}`, context: "Kage Level Assessment", type: "EXAM" };
    }
    return { title: `Level ${id} Training`, topic: "Advanced Anime Grammar & Vocabulary", context: "Advanced Arc", type: "TEACH" };
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
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, ...messages], temperature: 0.5, max_tokens: 600 })
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
