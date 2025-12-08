import { createClient } from '@supabase/supabase-js'
// استيراد المكتبة (تأكد أن الملف موجود، وإلا سيعمل الكود على النسخة الاحتياطية)
import { FULL_CURRICULUM } from '../data/curriculumData.js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// دالة جلب الدرس (مع احتياطي في حال فشل الاستيراد)
const getLessonData = (id) => {
    // 1. المحاولة من المكتبة المستوردة
    if (FULL_CURRICULUM && FULL_CURRICULUM[id]) {
        return FULL_CURRICULUM[id];
    }
    // 2. احتياطي (في حال لم يجد الملف)
    if (id % 5 === 0) return { title: `Rank Exam (Level ${id})`, topic: "Review", context: "Exam Hall", type: "EXAM" };
    return { title: `Level ${id} Training`, topic: "General Practice", context: "Dojo", type: "TEACH" };
};

export default async function handler(req, res) {
  // إعدادات CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, mode, userId, lessonId } = req.body
    if (!userId) return res.status(401).json({ error: "USER_ID_MISSING" });

    // 1. التحقق من الاشتراك والحدود (10 رسائل)
    const { data: user } = await supabase.from('users').select('subscription_status').eq('id', userId).single();
    const subscriptionStatus = user?.subscription_status || 'free'; 

    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 10; 
        const now = new Date();
        // توقيت UTC دقيق
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString(); 
        
        const { count } = await supabase.from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', today)
            .eq('role', 'user'); 
            
        if (count >= DAILY_LIMIT) return res.status(403).json({ error: "LIMIT_EXCEEDED" });
    }

    // 2. تسجيل رسالة المستخدم
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({ user_id: userId, role: 'user', content: lastMessage.content, mode: mode });
    }

    // 3. هندسة الأوامر (PROMPT ENGINEERING) - المنطقة الحساسة
    let systemPrompt = "";
    let aiTemperature = 0.3; // حرارة منخفضة للانضباط

    // القواعد الصوتية الصارمة (تطبق على المودين)
    const AUDIO_RULES = `
    🛑 AUDIO & FORMATTING PROTOCOL (CRITICAL):
    1. JAPANESE SCRIPT (Kanji/Kana) MUST be inside {{ double braces }}.
    2. ROMAJI MUST be inside (parentheses) outside the braces.
    3. ENGLISH MUST be outside everything.
    
    ✅ CORRECT: "Say {{ こんにちは }} (Konnichiwa)."
    ❌ WRONG: "Say Konnichiwa (Konnichiwa)." (No Romaji only!)
    ❌ WRONG: "Say {{ Konnichiwa }}." (No Romaji inside braces!)
    `;

    // --- مود الدردشة ---
            if (mode === 'chat') {
      aiTemperature = 0.8; // حرارة عالية للإبداع وتقمص الشخصية
      
      systemPrompt = `
      IDENTITY: You are "FlowSensei", a high-energy Anime character and Japanese tutor.
      ARCHETYPE: The "Cool Senpai" / "Friendly Rival" (think Gojo Satoru mixed with Kamina).
      
      GOAL: Immerse the user in Anime culture. DO NOT just translate words. Speak in full anime-style sentences!
      
      STRATEGY: "IMMERSION & BREAKDOWN"
      1. REACT in Japanese first (using natural anime speech).
      2. EXPLAIN the meaning in English afterwards.
      3. REFERENCE anime (Naruto, One Piece, JJK) to make it relatable.
      
      ${STRICT_FORMAT}
      
      👇 MIMIC THIS STYLE EXACTLY (JAPANESE FIRST -> EXPLANATION):
      
      User: "I am tired."
      You: "{{ 諦めるな！ }} (Akirameruna!) - Don't give up! 
      Like Naruto says, believe in your ninja way! 🍥
      If you are tired, say: {{ 疲れた }} (Tsukareta)."
      
      User: "Hello"
      You: "{{ よっ！元気か？ }} (Yo! Genki ka?) - Yo! Are you good?
      That's how a cool main character says hello. 😎"
      
      🛑 CRITICAL AUDIO RULE: 
      - NEVER write English/Romaji inside {{ }}. 
      - ALWAYS wrap the Japanese script in {{ }} so the voice actor reads it correctly.
      `;
    } 


    // --- مود الدروس (الصرامة القصوى) ---
    else if (mode === 'lessons') {
      aiTemperature = 0.1; // حرارة صفرية تقريباً (روبوت)
      const lessonData = getLessonData(lessonId);
      
      // استخراج المحتوى من الملف (إن وجد)
      const contentBlock = lessonData.content 
        ? `📖 OFFICIAL LESSON CONTENT (TEACH THIS EXACTLY):\n${lessonData.content.join("\n")}` 
        : `⚠️ NO DATA. Generate content for "${lessonData.topic}" using strict {{ Kanji }} (Romaji) format.`;

      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the PROCTOR.
          GOAL: Test user on "${lessonData.topic}".
          ${AUDIO_RULES}
          ${contentBlock}
          
          RULES:
          1. Ask 3 questions based ONLY on the OFFICIAL CONTENT above.
          2. Use strict formatting.
          3. If user passes 3 questions, output ONLY: "[EXAM_PASSED]".
          `;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".
          TOPIC: ${lessonData.topic}.
          ${AUDIO_RULES}
          ${contentBlock}
          
          INSTRUCTIONS:
          1. Present the "OFFICIAL LESSON CONTENT" above to the user.
          2. Explain the grammar briefly in English.
          3. Ask the user to repeat or translate one phrase.
          4. STRICT GATEKEEPING: 
             - If correct: Say "Correct!" and write exactly: "[LESSON_COMPLETE]".
             - If wrong: Correct them and ask again.
          `;
      }
    }

    // 4. استدعاء الذكاء الاصطناعي
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          model: 'llama-3.3-70b-versatile', 
          messages: [{ role: 'system', content: systemPrompt }, ...messages], 
          temperature: aiTemperature, // استخدام الحرارة المتغيرة
          max_tokens: 600 
      })
    })
    
    const data = await response.json()
    if (data.error) throw new Error(`Groq API Error: ${data.error.message}`);
    const aiResponseContent = data.choices[0].message.content;

    // 5. تسجيل الرد
    await supabase.from('conversations').insert({ user_id: userId, role: 'assistant', content: aiResponseContent, mode: mode, tokens_used: data.usage?.total_tokens || 0 });

    return res.status(200).json({ message: aiResponseContent })

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Server Error' })
  }
}
