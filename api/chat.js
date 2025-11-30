import { createClient } from '@supabase/supabase-js'

// التحقق من وجود المفاتيح
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

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

    // 🛑 1. تأكيد وجود هوية المستخدم
    if (!userId) {
        return res.status(401).json({ error: "USER_ID_MISSING" });
    }

    // 🛑 2. منطق الحد المجاني والاشتراك
    // 1. جلب بيانات المستخدم
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('subscription_status, subscription_ends_at')
        .eq('id', userId)
        .single();
    
    if (userError) console.error("User fetch error:", userError);

    // 2. التحقق من انتهاء الصلاحية
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
        return res.status(403).json({ error: "SUBSCRIPTION_EXPIRED" }); 
    }
    
    const subscriptionStatus = user?.subscription_status || 'free'; 

    // 3. التحقق من الحد اليومي (للـ Free فقط)
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

    // ✅ 4. حفظ رسالة المستخدم في قاعدة البيانات (هذا ما كان ينقصنا!) ✅
    // بدون هذه الخطوة، العداد لن يزيد أبداً
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({
            user_id: userId,
            role: 'user',
            content: lastMessage.content,
            mode: mode
        });
    }

    // 5. هندسة الأوامر (Prompts)
    let systemPrompt = "";
    const commonRules = `
    IMPORTANT FOR TTS (TEXT TO SPEECH):
    1. Use Japanese punctuation (、 and 。) frequently. This creates natural pauses in the voice.
    2. Example: "Sugoi! (すごい！)" is better than "Sugoi".
    3. Keep sentences short and punchy like an Anime character.
    `;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", a cool, energetic Japanese tutor obsessed with Anime. ${commonRules} Reply mainly in English but teach Japanese phrases. Every example MUST come from popular anime.`;
    } 
    else if (mode === 'lessons') {
      systemPrompt = `You are guiding the user through Lesson ${lessonId}. ${commonRules} Explain the topic using Anime examples. Give 3 key phrases. Say EXACTLY: "LESSON_COMPLETE" if they get it right.`;
    }

    // 6. الاتصال بـ Groq
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
        temperature: 0.8,
        max_tokens: 600
      })
    })
    
    const data = await response.json()

    if (data.error) {
        throw new Error(`Groq API Error: ${data.error.message}`);
    }

    const aiResponseContent = data.choices[0].message.content;

    // ✅ 7. حفظ رد الـ AI في قاعدة البيانات (للسجل) ✅
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
