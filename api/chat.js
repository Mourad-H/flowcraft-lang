import { createClient } from '@supabase/supabase-js'

// التحقق من وجود المفاتيح
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  // هذا سيجبر Vercel على إظهار الخطأ إذا لم تكن المفاتيح موجودة
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  // إعدادات CORS (لا تغيير)
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, mode, userId, lessonId } = req.body
    // 🛑 1. تأكيد وجود هوية المستخدم (CRITICAL FIX)
    if (!userId) {
        // إذا كان المستخدم مجهولاً، نتوقف ونطلب الدخول
        return res.status(401).json({ error: "USER_ID_MISSING" });
    }

    // 🛑 1. منطق الحد المجاني (The Paywall) 🛑
    if (userId) {
        // 🛑 ابحث عن منطق التحقق من الاشتراك القديم واستبدله بالكامل بهذا الكود 🛑

    // 1. جلب بيانات المستخدم للتحقق من انتهاء الصلاحية
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('subscription_status, subscription_ends_at') // جلب عمود انتهاء الصلاحية
        .eq('id', userId)
        .single();
    
    if (userError) {
        console.error("User fetch error:", userError);
        // نواصل بوضع مجاني إذا فشل جلب بيانات المستخدم
    }

    // 2. التحقق من انتهاء الصلاحية (Expiration Check)
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        // إذا انتهت صلاحية الاشتراك، نغير الحالة ونرد بخطأ
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
        return res.status(403).json({ error: "SUBSCRIPTION_EXPIRED" }); 
    }
    
    // تحديد حالة الاشتراك بناءً على البيانات: إذا لم يكن هناك مستخدم، فالحالة 'free'
    const subscriptionStatus = user?.subscription_status || 'free'; 

    // 🛑 3. منطق الحد المجاني (3 رسائل فقط للمستخدمين غير المشتركين)
    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 3; // ✅ الحد المجاني الجديد: 3 رسائل فقط
        const today = new Date().toISOString().split('T')[0]; // تاريخ اليوم فقط

        // نعد رسائل المستخدم لهذا اليوم (فقط الرسائل التي أرسلها المستخدم 'role: user')
        const { count, error: countError } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', today) 
            .eq('role', 'user'); 

        if (countError) console.error("Limit Check Error:", countError);
        
        if (count >= DAILY_LIMIT) {
            // خطأ مخصص يخبر الواجهة الأمامية بضرورة الترقية
            return res.status(403).json({ error: "UPGRADE_REQUIRED" });
        }
    }
    
// 🛑 هنا ينتهي منطق التحقق، ويستمر باقي الكود في الملف (كود استدعاء OpenAI) 🛑
    }
    // نهاية منطق الحد المجاني -- إذا وصل الكود إلى هنا، فالمستخدم إما مدفوع أو ضمن الحد

    // 2. هندسة الأوامر المحسنة للصوت (TTS OPTIMIZED PROMPTS) 🎤
    let systemPrompt = "";
    // ... بقية الـ Prompts كما هي

    const commonRules = `
    IMPORTANT FOR TTS (TEXT TO SPEECH):
    1. Use Japanese punctuation (、 and 。) frequently. This creates natural pauses in the voice.
    2. Example: "Sugoi! (すごい！)" is better than "Sugoi".
    3. Keep sentences short and punchy like an Anime character.
    4. Don't use complex markdown or lists if possible, talk like a human.
    `;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", a cool, energetic Japanese tutor obsessed with Anime.
      
      ${commonRules}
      
      BEHAVIOR:
      - Reply mainly in English but teach Japanese phrases.
      - Every example MUST come from popular anime (Naruto, One Piece, JJK, Demon Slayer).
      - If teaching grammar, use anime quotes.
      - Use emojis like 🎌, ⚔️, 🍥 to separate sections.
      `;
    } 
    else if (mode === 'lessons') {
      systemPrompt = `You are guiding the user through Lesson ${lessonId}.
      
      ${commonRules}
      
      LESSON CONTEXT:
      - Lesson 1: Greetings (Ohayou, Konnichiwa).
      - Lesson 2: Introductions (Watashi wa...).
      - Lesson 3: Battle Phases.
      
      INSTRUCTIONS:
      - Explain the topic using Anime examples.
      - Give 3 key phrases.
      - Ask the user to repeat one.
      - If they get it right, say EXACTLY: "LESSON_COMPLETE" at the end of your sentence.
      `;
    }

    // 3. الاتصال بـ Groq (Llama 3.3)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // الموديل الجديد
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.8,
        max_tokens: 600
      })
    })
    
    // ... logging conversation (Optional - we skip logging here to simplify code)
    
    const data = await response.json()

    if (data.error) {
        throw new Error(`Groq API Error: ${data.error.message}`);
    }

    return res.status(200).json({ message: data.choices[0].message.content })

  } catch (error) {
    console.error("🔥 FATAL API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Unknown Server Error' })
  }
}