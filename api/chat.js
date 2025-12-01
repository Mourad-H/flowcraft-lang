import { createClient } from '@supabase/supabase-js'

// --- 1. CONFIGURATION & CHECKS ---
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ✅ THE CURRICULUM MAP (The "Brain" of the Structured Path)
const CURRICULUM = {
    1: { title: "The First Meeting", topic: "Basic Greetings (Ohayou, Konnichiwa)", context: "Anime School Life", type: "TEACH" },
    2: { title: "Who Am I?", topic: "Self Introduction (Watashi wa... desu)", context: "Shonen Protagonist Intro", type: "TEACH" },
    3: { title: "Yes, No, Maybe", topic: "Hai, Iie, and basic agreement", context: "Detective Anime Interrogation", type: "TEACH" },
    4: { title: "Review & Practice", topic: "Review of Lessons 1-3", context: "Training Montage", type: "TEACH" },
    5: { title: "GENIN EXAM", topic: "Test on Lessons 1-4", context: "Chunin Exam Arena", type: "EXAM" },
    6: { title: "The Object", topic: "Kore, Sore, Are (This, That)", context: "Shopping in Akihabara", type: "TEACH" },
    // Add more lessons as needed...
};

export default async function handler(req, res) {
  // --- 2. CORS SETUP ---
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, mode, userId, lessonId } = req.body

    // 🛑 SECURITY: User ID Check
    if (!userId) return res.status(401).json({ error: "USER_ID_MISSING" });

    // --- 3. SUBSCRIPTION & LIMIT LOGIC ---
    // 1. Fetch User Data
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('subscription_status, subscription_ends_at')
        .eq('id', userId)
        .single();
    
    if (userError) console.error("User fetch error:", userError);

    // 2. Check Expiration
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
        return res.status(403).json({ error: "SUBSCRIPTION_EXPIRED" }); 
    }
    
    const subscriptionStatus = user?.subscription_status || 'free'; 

    // 3. Check Daily Limit (For Free Users Only)
    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 3; 
        const today = new Date().toISOString().split('T')[0]; 

        const { count, error: countError } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', today) 
            .eq('role', 'user'); 

        if (countError) console.error("Limit Check Error:", countError);
        
        if (count >= DAILY_LIMIT) {
            return res.status(403).json({ error: "LIMIT_EXCEEDED" });
        }
    }

    // ✅ LOGGING: Save User Message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({
            user_id: userId, role: 'user', content: lastMessage.content, mode: mode
        });
    }

    // --- 4. PROMPT ENGINEERING (The "Soul" of the AI) ---
    let systemPrompt = "";
    
    const commonRules = `
    IMPORTANT FOR TTS (TEXT TO SPEECH):
    1. Use Japanese punctuation (、 and 。) frequently. This creates natural pauses in the voice.
    2. Example: "Sugoi! (すごい！)" is better than "Sugoi".
    3. Keep sentences short and punchy.
    `;

    // MODE A: CHAT (Sandbox / Friend)
    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", a cool, energetic Japanese tutor obsessed with Anime.
      ${commonRules}
      ROLE: Friendly Rival / Senpai.
      GOAL: Free conversation. React to whatever the user says using Anime references.
      - Reply mainly in English but teach Japanese phrases.
      - Every example MUST come from popular anime (Naruto, One Piece, JJK, Demon Slayer).
      - If teaching grammar, use anime quotes.
      `;
    } 
    // MODE B: STRUCTURED LESSONS (Strict / Campaign)
    else if (mode === 'lessons') {
      const lessonData = CURRICULUM[lessonId] || { title: "Advanced", topic: "Free Talk", type: "TEACH", context: "Mastery" };
      
      // Sub-Mode: EXAM (Boss Fight)
      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR of the ${lessonData.title}.
          ${commonRules}
          CONTEXT: ${lessonData.context}.
          GOAL: Test the user on: ${lessonData.topic}.
          
          RULES:
          1. Act strict and serious. No help allowed.
          2. Ask 3 distinct questions to test their knowledge of previous lessons.
          3. If the user answers correctly, praise them briefly and move to the next question.
          4. ONLY when they have proven mastery of the topic, you MUST end your message with this exact tag: "[EXAM_PASSED]".
          5. If they fail, tell them to study more.
          `;
      } 
      // Sub-Mode: TEACHING (Standard Level)
      else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          ${commonRules}
          TOPIC: ${lessonData.topic}.
          CONTEXT: ${lessonData.context}.
          
          INSTRUCTIONS:
          1. Explain the topic clearly using examples from the Context.
          2. Give the user a sentence to translate or repeat.
          3. STRICT GATEKEEPING: Do NOT move to a new topic until the user gets the current one right.
          4. If they answer correctly, give them praise and end your message with this exact tag: "[LESSON_COMPLETE]".
          5. If they answer incorrectly, explain why and ask them to try again.
          `;
      }
    }

    // --- 5. AI GENERATION (Groq) ---
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    })
    
    const data = await response.json()

    if (data.error) {
        throw new Error(`Groq API Error: ${data.error.message}`);
    }

    const aiResponseContent = data.choices[0].message.content;

    // ✅ LOGGING: Save AI Response
    await supabase.from('conversations').insert({
        user_id: userId,
        role: 'assistant',
        content: aiResponseContent,
        mode: mode,
        tokens_used: data.usage?.total_tokens || 0
    });

    return res.status(200).json({ message: aiResponseContent })

  } catch (error) {
    console.error("🔥 FATAL API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Unknown Server Error' })
  }
}
