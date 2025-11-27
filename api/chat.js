import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

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

    // 1. التحقق من الاشتراك
    const { data: user } = await supabase
      .from('users')
      .select('subscription_status')
      .eq('id', userId)
      .single()

    if (!user || user.subscription_status !== 'active') {
       // اسمح برسالة ترحيبية واحدة فقط للمجانيين
       if (messages.length > 2) return res.status(403).json({ error: 'Subscription required' })
    }

    // 2. هندسة الأوامر (PROMPT ENGINEERING) - نكهة الأنمي 🍥
    let systemPrompt = "";

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", a cool, energetic Japanese tutor who is obsessed with Anime. 
      Your goal is to teach Japanese through Anime references.
      
      RULES:
      1. Every example MUST come from a popular anime (Naruto, One Piece, JJK, Demon Slayer, AOT, Spy x Family).
      2. If teaching grammar, use anime quotes. Example: "In Naruto, they say 'Dattebayo' which is a sentence ender..."
      3. Correct mistakes gently but clearly.
      4. Use emojis like 🎌, ⚔️, 🍥, 🍜.
      5. Keep responses short and conversational.
      6. If the user speaks English, reply in English but teach Japanese words.`;
    } 
    else if (mode === 'lessons') {
      // هنا "خدعة" الدروس. الذكاء الاصطناعي يمثل دور المعلم المنهجي
      systemPrompt = `You are guiding the user through Lesson ${lessonId}.
      
      LESSON CONTEXT:
      - Lesson 1: The Shonen Protagonist Greetings (Ohayou, Konnichiwa, Osu!)
      - Lesson 2: The Nakama Introductions (Watashi wa, Ore wa...)
      - Lesson 3: Battle Phases (Yamero, Tatakae, Nigero!)
      
      INSTRUCTIONS:
      1. Explain the specific topic for Lesson ${lessonId} using Anime examples.
      2. Give 3 key phrases.
      3. Ask the user to repeat or translate one phrase to pass the lesson.
      4. If they get it right, say "LESSON_COMPLETE" so the frontend knows to unlock the next one.
      5. Be structured but exciting. Like All Might teaching a class.`;
    }

    // 3. الاتصال بـ Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    })

    const data = await response.json()
    return res.status(200).json({ message: data.choices[0].message.content })

  } catch (error) {
    return res.status(500).json({ error: 'Server Error' })
  }
}