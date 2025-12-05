import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.GROQ_API_KEY) {
  throw new Error("MISSING ENV VARIABLES IN VERCEL");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ============================================================
// المنهج الأساسي
// ============================================================
const BASE_CURRICULUM = {
    1: { title: "The First Meeting", topic: "Basic Greetings (Ohayou, Konnichiwa)", context: "Anime School Life", type: "TEACH" },
    2: { title: "Who Am I?", topic: "Self Introduction (Watashi wa... desu)", context: "Shonen Protagonist Intro", type: "TEACH" },
    3: { title: "Yes, No, Maybe", topic: "Hai, Iie, and basic agreement", context: "Detective Anime Interrogation", type: "TEACH" },
    4: { title: "Review & Practice", topic: "Review of Lessons 1-3", context: "Training Montage", type: "TEACH" },
    5: { title: "GENIN EXAM", topic: "Test on Lessons 1-4", context: "Chunin Exam Arena", type: "EXAM" },
    6: { title: "The Object", topic: "Kore, Sore, Are (This, That)", context: "Shopping in Akihabara", type: "TEACH" },
    7: { title: "Existence", topic: "Imasu / Arimasu (Living vs Non-living)", context: "Searching for a villain", type: "TEACH" },
    8: { title: "School Titles", topic: "Senpai, Kouhai, Sensei", context: "High School Drama", type: "TEACH" },
    9: { title: "Time", topic: "Ima nanji desu ka?", context: "Running late for school", type: "TEACH" },
    10: { title: "Midterms", topic: "Review Lessons 6-9", context: "School Midterm Exams", type: "EXAM" },
    11: { title: "Power Verbs", topic: "Taberu, Iku, Tatakau (Dict form)", context: "Planning a battle", type: "TEACH" },
    12: { title: "Destinations", topic: "Particle 'Ni' (To go to...)", context: "Heading to the dungeon", type: "TEACH" },
    13: { title: "Objects of Action", topic: "Particle 'O' (Eat ramen)", context: "Naruto eating Ichiraku Ramen", type: "TEACH" },
    14: { title: "Command Form", topic: "Nigero! Yame! (Run/Stop)", context: "Giving orders in battle", type: "TEACH" },
    15: { title: "Chunin Exam", topic: "Review Lessons 11-14", context: "Forest of Death", type: "EXAM" },
};

const getLesson = (id) => {
    if (BASE_CURRICULUM[id]) return BASE_CURRICULUM[id];
    if (id % 5 === 0) {
        return { title: `Rank ${id} Exam`, topic: `Mastery Test for Level ${id}`, context: "Kage Level Assessment", type: "EXAM" };
    }
    return { title: `Level ${id} Training`, topic: "Advanced Anime Grammar & Vocabulary", context: "Advanced Arc", type: "TEACH" };
};

// ✅ دالة تحويل Romaji إلى Hiragana/Katakana (مبسطة)
const romajiToKana = {
    // Hiragana
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を', 'n': 'ん',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'da': 'だ', 'de': 'で', 'do': 'ど',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
};

// ✅ قاموس Romaji إلى Kanji للكلمات الشائعة
const commonKanji = {
    'hon': '本',
    'kore': 'これ',
    'sore': 'それ',
    'are': 'あれ',
    'watashi': '私',
    'desu': 'です',
    'ohayou': 'おはよう',
    'konnichiwa': 'こんにちは',
    'arigatou': 'ありがとう',
    'sayonara': 'さようなら',
    'sensei': '先生',
    'gakusei': '学生',
    'nihon': '日本',
    'eigo': '英語',
    'taberu': '食べる',
    'iku': '行く',
    'kuru': '来る',
    'miru': '見る',
    'yomu': '読む',
};

// ✅ دالة معالجة النص بعد استلامه من AI
function fixJapaneseFormatting(text) {
    // البحث عن الأنماط الخاطئة وإصلاحها
    
    // Pattern 1: "Kore wa hon desu (Kore wa hon desu)"
    // يجب تحويلها إلى: "{{ これは本です }} (Kore wa hon desu)"
    
    // Pattern 2: تحويل الكلمات اليابانية المعروفة
    let fixed = text;
    
    // استبدال الكلمات الشائعة بـ Kanji
    for (const [romaji, kanji] of Object.entries(commonKanji)) {
        // البحث عن الكلمة بمفردها (مع حدود الكلمة)
        const regex = new RegExp(`\\b${romaji}\\b(?!\\))`, 'gi');
        fixed = fixed.replace(regex, (match) => {
            // إذا كانت الكلمة داخل أقواس، لا نغيرها
            return kanji;
        });
    }
    
    // إصلاح التنسيق: إضافة {{ }} حول الأحرف اليابانية
    // البحث عن الأحرف اليابانية غير المُنسقة
    fixed = fixed.replace(/([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)(?!\s*\})/g, (match) => {
        // التحقق من أنها ليست محاطة بـ {{ }} بالفعل
        return `{{ ${match} }}`;
    });
    
    // إزالة التكرار المزدوج إذا وُجد
    fixed = fixed.replace(/\{\{\s*\{\{/g, '{{');
    fixed = fixed.replace(/\}\}\s*\}\}/g, '}}');
    
    return fixed;
}

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

    // التحقق من الاشتراك
    const { data: user } = await supabase.from('users').select('subscription_status, subscription_ends_at').eq('id', userId).single();
    
    if (user && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
        await supabase.from('users').update({ subscription_status: 'expired' }).eq('id', userId);
    }
    
    const subscriptionStatus = user?.subscription_status || 'free'; 

    if (subscriptionStatus !== 'active') {
        const DAILY_LIMIT = 10;
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString(); 

        const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', today).eq('role', 'user'); 
        
        if (count >= DAILY_LIMIT) return res.status(403).json({ error: "LIMIT_EXCEEDED" });
    }

    // حفظ رسالة المستخدم
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('conversations').insert({ user_id: userId, role: 'user', content: lastMessage.content, mode: mode });
    }

    // ✅ Prompt محسّن ومبسط للحصول على نتائج أفضل
    let systemPrompt = "";
    
    const ULTRA_STRICT_FORMAT = `
🚨 ABSOLUTE CRITICAL RULE - READ 3 TIMES:

When writing Japanese phrases:
1. You MUST write the Japanese characters (Hiragana/Katakana/Kanji) FIRST
2. Then put the Romaji in parentheses AFTER

✅ ONLY ACCEPTABLE FORMAT:
これは本です (Kore wa hon desu)
こんにちは (Konnichiwa)
ありがとう (Arigatou)

❌ NEVER DO THIS:
Kore wa hon desu (This is a book)
Konnichiwa (Hello)

🎯 REMEMBER: Japanese script FIRST, Romaji pronunciation SECOND in ( )

For audio to work, Japanese must be in its native script!
`;

    if (mode === 'chat') {
      systemPrompt = `You are "FlowSensei", an Anime Japanese tutor who ALWAYS writes Japanese in its native script.

${ULTRA_STRICT_FORMAT}

Your personality: Friendly Senpai who loves anime.
Your goal: Teach Japanese naturally through conversation.

Rules:
- Mix Japanese phrases into English conversation
- ALWAYS write Japanese in Japanese characters, never in Romaji alone
- Add Romaji in ( ) after Japanese text for pronunciation help
- Use anime references to make learning fun
- Use emojis: 🎌 ⚔️ 🍥 ✨

Example conversation:
User: "Hi!"
You: "やあ！ (Yaa!) Welcome back! 🎌 Ready to level up your Japanese?"
`;
    } 
    else if (mode === 'lessons') {
      const lessonData = getLesson(lessonId);
      
      if (lessonData.type === 'EXAM') {
          systemPrompt = `You are the EXAM PROCTOR for "${lessonData.title}".

${ULTRA_STRICT_FORMAT}

Context: ${lessonData.context}
Testing: ${lessonData.topic}

EXAM RULES:
1. Ask 3 progressive questions (easy → medium → hard)
2. For EACH answer:
   - If WRONG: Give hint and ask again
   - If CORRECT: Say "正解！ (Seikai! - Correct!)" and move to next question
3. After 3 correct answers, write exactly: [EXAM_PASSED]

CRITICAL: Write ALL Japanese words in Japanese script with Romaji in ( ) after!
`;
      } else {
          systemPrompt = `You are Sensei teaching Lesson ${lessonId}: "${lessonData.title}".

${ULTRA_STRICT_FORMAT}

Topic: ${lessonData.topic}
Context: ${lessonData.context}

TEACHING PROTOCOL:
1. Explain the concept clearly in English
2. Give 3-4 examples using JAPANESE SCRIPT (not Romaji!)
3. Format: これは本です (Kore wa hon desu)
4. Ask student to practice
5. When they answer CORRECTLY, immediately write: [LESSON_COMPLETE]

CRITICAL: Every Japanese word must be in Japanese characters, with Romaji in ( ) after for pronunciation!

Example teaching:
"Today we learn 'Kore, Sore, Are' - the words for 'this, that, that over there'.

これ (Kore) = This (near you)
それ (Sore) = That (near listener)  
あれ (Are) = That over there (far from both)

For example: これは本です (Kore wa hon desu) = This is a book.

Now you try! Point at something near you and make a sentence."
`;
      }
    }

    // استدعاء AI
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: 'llama-3.3-70b-versatile', 
        messages: [{ role: 'system', content: systemPrompt }, ...messages], 
        temperature: 0.3, // ✅ خفض الحرارة لتحكم أفضل
        max_tokens: 600 
      })
    })
    
    const data = await response.json()
    if (data.error) throw new Error(`Groq API Error: ${data.error.message}`);

    let aiResponseContent = data.choices[0].message.content;

    // ✅ معالجة النص بعد الاستلام
    aiResponseContent = fixJapaneseFormatting(aiResponseContent);

    // حفظ الرد
    await supabase.from('conversations').insert({ 
      user_id: userId, 
      role: 'assistant', 
      content: aiResponseContent, 
      mode: mode, 
      tokens_used: data.usage?.total_tokens || 0 
    });

    return res.status(200).json({ message: aiResponseContent })

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return res.status(500).json({ error: error.message || 'Server Error' })
  }
}