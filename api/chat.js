import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ============================================================
// 📜 THE GRAND CURRICULUM (100 LEVELS OF ANIME JAPANESE)
// ============================================================
const CURRICULUM = {
    // --- ARC 1: THE GENIN BEGINNINGS (Basics) ---
    1: { title: "First Encounter", topic: "Greetings (Ohayou, Konnichiwa)", context: "Meeting a new nakama", type: "TEACH" },
    2: { title: "Identity", topic: "Self Intro (Watashi wa... desu)", context: "Shonen Protagonist Intro", type: "TEACH" },
    3: { title: "Yes & No", topic: "Hai, Iie, Sou desu", context: "Interrogation Scene", type: "TEACH" },
    4: { title: "The Numbers", topic: "Counting 1-10", context: "Countdown to explosion", type: "TEACH" },
    5: { title: "Genin Exam", topic: "Review Lessons 1-4", context: "Academy Graduation Exam", type: "EXAM" },
    
    // --- ARC 2: SCHOOL LIFE (Slice of Life) ---
    6: { title: "Objects", topic: "Kore, Sore, Are (This/That)", context: "Shopping in Akihabara", type: "TEACH" },
    7: { title: "Existence", topic: "Imasu / Arimasu (Living vs Non-living)", context: "Searching for a villain", type: "TEACH" },
    8: { title: "School Titles", topic: "Senpai, Kouhai, Sensei", context: "High School Drama", type: "TEACH" },
    9: { title: "Time", topic: "Ima nanji desu ka?", context: "Running late for school", type: "TEACH" },
    10: { title: "Midterms", topic: "Review Lessons 6-9", context: "School Midterm Exams", type: "EXAM" },

    // --- ARC 3: BATTLE MODE (Shonen Style) ---
    11: { title: "Power Verbs", topic: "Taberu, Iku, Tatakau (Dict form)", context: "Planning a battle", type: "TEACH" },
    12: { title: "Destinations", topic: "Particle 'Ni' (To go to...)", context: "Heading to the dungeon", type: "TEACH" },
    13: { title: "Objects of Action", topic: "Particle 'O' (Eat ramen)", context: "Naruto eating Ichiraku Ramen", type: "TEACH" },
    14: { title: "Command Form", topic: "Nigero! Yame! (Run/Stop)", context: "Giving orders in battle", type: "TEACH" },
    15: { title: "Chunin Exam", topic: "Review Lessons 11-14", context: "Forest of Death", type: "EXAM" },

    // --- ARC 4: EMOTIONS & DRAMA ---
    16: { title: "Adjectives I", topic: "i-adjectives (Sugoi, Kowai)", context: "Reacting to power levels", type: "TEACH" },
    17: { title: "Adjectives II", topic: "na-adjectives (Kirei, Baka)", context: "Describing a crush", type: "TEACH" },
    18: { title: "Past Tense", topic: "Deshita / Mashta", context: "Flashback scene", type: "TEACH" },
    19: { title: "Wanting", topic: "Tai form (Tabetai - want to eat)", context: "Expressing desire for power", type: "TEACH" },
    20: { title: "Jonin Exam", topic: "Review Lessons 16-19", context: "Tournament Finals", type: "EXAM" },

    // --- ARC 5: ADVANCED NAKAMA ---
    21: { title: "Te-Form", topic: "Requesting (Matte, Mite)", context: "Asking for help", type: "TEACH" },
    22: { title: "Prohibitions", topic: "Damem (Don't do it)", context: "Stopping a friend", type: "TEACH" },
    23: { title: "Abilities", topic: "Dekiru (Can do)", context: "Showing off new Jutsu", type: "TEACH" },
    24: { title: "Reasons", topic: "Kara / Node (Because...)", context: "Explaining the villain's motive", type: "TEACH" },
    25: { title: "Anbu Mission", topic: "Review Lessons 21-24", context: "Secret Mission", type: "EXAM" },

    // ... (Expanding to 100 logically) ...
    // إذا وصل الطالب لدرس غير معرف، نعطيه درس "محادثة حرة متقدمة"
};

// دالة للحصول على الدرس أو توليد درس افتراضي للمستويات العليا
const getLesson = (id) => {
    if (CURRICULUM[id]) return CURRICULUM[id];
    // للمستويات من 26 إلى 100:
    if (id % 5 === 0) return { title: `Rank ${id} Exam`, topic: `Mastery Test for Level ${id}`, context: "Kage Level Assessment", type: "EXAM" };
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

    // --- SUBSCRIPTION & LIMITS ---
    const { data: user } = await supabase.from('users').select('subscription_status, subscription_ends_at').eq('id', userId).single();
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
    }
    const subscriptionStatus = user?.subscription_status || 'free'; 

    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 10; // ✅ 10 رسائل يومية
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString(); 
        const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', today).eq('role', 'user'); 
        if (count >= DAILY_LIMIT) return res.status(403).json({ error: "LIMIT_EXCEEDED" });
    }

    // --- LOGGING ---
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({ user_id: userId, role: 'user', content: lastMessage.content, mode: mode });
    }

    // --- PROMPT ENGINEERING (THE STRICT CORE) ---
    let systemPrompt = "";
    
    // 🛑 الدستور الموحد الصارم (يطبق على الجميع)
    const STRICT_RULES = `
    🛑 CRITICAL INSTRUCTIONS (DO NOT IGNORE):
    1. FORMATTING: You MUST wrap ALL Japanese script (Kanji/Kana) inside double curly braces {{ }}.
    2. ROMAJI: Must be placed OUTSIDE the brackets in parentheses.
    3. CORRECT: "This is {{ 素晴らしい }} (Subarashii)!"
    4. WRONG: "This is {{ Subarashii }}." (NEVER do this).
    5. WRONG: "This is Subarashii (Subarashii)."
    6. If you write Japanese inside {{ }} using English letters, the system crashes. USE KANJI/KANA ONLY inside {{ }}.
    `;

    // مود الدردشة (حر ولكن منضبط في الكتابة)
    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", an energetic Anime Japanese tutor.
      ROLE: Friendly Rival / Senpai.
      GOAL: Fun conversation about anime, manga, and culture.
      
      ${STRICT_RULES}
      
      - Speak naturally, use slang like "Sugoi", "Yatta".
      - Reply mainly in English but mix in Japanese phrases using the format above.
      - Use emojis: 🎌, ⚔️, 🍥.
      `;
    } 
    // مود الدروس (صارم جداً في الموضوع)
    else if (mode === 'lessons') {
      const lessonData = getLesson(lessonId);
      
      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR of the ${lessonData.title}.
          CONTEXT: ${lessonData.context}. 
          GOAL: Test the user on: ${lessonData.topic}.
          
          ${STRICT_RULES}
          
          RULES: 
          1. Ask 3 distinct questions to test their mastery.
          2. DO NOT HELP. This is a test.
          3. If they fail, tell them to study more.
          4. ONLY if they pass all 3, end your final message with: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          TOPIC: ${lessonData.topic}.
          CONTEXT: ${lessonData.context}.
          
          ${STRICT_RULES}
          
          INSTRUCTIONS: 
          1. EXPLAIN the topic clearly in English first.
          2. PROVIDE examples using the strict format: {{ Kanji }} (Romaji).
          3. ASK the user to translate or repeat a phrase.
          4. GATEKEEPING: 
             - If they answer WRONG: Correct them and ask again. Do NOT move on.
             - If they answer RIGHT: Say "Correct!" and IMMEDIATELY end with: "[LESSON_COMPLETE]".
          5. STAY ON TOPIC. If the user talks about something else, bring them back to ${lessonData.topic}.
          `;
      }
    }

    // --- AI CALL ---
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
