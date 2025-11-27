import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Zap, MessageCircle, BookOpen, Lock, Star, ChevronRight, Send, Volume2, LogOut } from 'lucide-react';

export default function FlowCraftLang() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // ✅ إصلاح اللابتوب: شاشة تحميل
  const [userTier, setUserTier] = useState('free');
  const [mode, setMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const scrollRef = useRef(null);

  // رابط Lemon Squeezy (استبدله برابطك)
  const CHECKOUT_URL = "https://your-store.lemonsqueezy.com/checkout/buy/variant-id";

  useEffect(() => {
    // التحقق من الجلسة عند بدء التشغيل
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkSubscription(session.user.id);
      setAuthLoading(false); // ✅ انتهى التحميل
    });

    // الاستماع للتغييرات (تسجيل دخول/خروج)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkSubscription(session.user.id);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkSubscription = async (userId) => {
    // يمكنك هنا التحقق من قاعدة البيانات
    // للتجربة سنجعله دائماً free إلا إذا عدلته يدوياً
    setUserTier('free'); 
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      alert("Login Error: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMode(null);
    setMessages([]);
  };

  // ✅ إصلاح الصوت للموبايل
  const speak = (text) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech not supported on this device.");
      return;
    }

    // إيقاف أي صوت سابق
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // محاولة فرض اليابانية
    utterance.rate = 0.9;
    
    // محاولة العثور على صوت ياباني بذكاء
    const voices = window.speechSynthesis.getVoices();
    const japanVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
    
    if (japanVoice) {
      utterance.voice = japanVoice;
    }

    // تشغيل الصوت
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          mode: mode,
          lessonId: currentLesson,
          userId: session?.user?.id
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Server Error");
      }

      const aiMsgContent = data.message || "Error: No response";
      
      // إضافة رد الـ AI
      if (aiMsgContent.includes("LESSON_COMPLETE")) {
         const cleanMsg = aiMsgContent.replace("LESSON_COMPLETE", "");
         setMessages(prev => [...prev, { role: 'assistant', content: cleanMsg + "\n\n🎉 Level Up!" }]);
         setCurrentLesson(prev => prev + 1);
         speak(cleanMsg); // نطق الرد تلقائياً
      } else {
         setMessages(prev => [...prev, { role: 'assistant', content: aiMsgContent }]);
         // ملاحظة: المتصفحات قد تمنع النطق التلقائي هنا، لذا يوجد زر Pronounce
      }

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openLemonSqueezy = () => {
    const url = `${CHECKOUT_URL}?checkout[email]=${session?.user.email}`;
    window.location.href = url;
  };

  // 0. LOADING SCREEN (الحل لمشكلة اللابتوب)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-anime-bg flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-anime-primary mb-4"></div>
        <p className="text-xl font-bold animate-pulse">Loading Chakra... 🌀</p>
      </div>
    );
  }

  // 1. LANDING PAGE
  if (!session) {
    return (
      <div className="min-h-screen bg-anime-bg text-white font-sans selection:bg-anime-accent selection:text-white">
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <Zap className="text-anime-warning" fill="currentColor" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-anime-primary to-anime-accent">
              FlowCraftLang
            </span>
          </div>
          <button onClick={handleLogin} className="bg-white text-anime-bg px-6 py-2 rounded-full font-bold hover:scale-105 transition shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Login with Google
          </button>
        </nav>

        <div className="flex flex-col items-center justify-center mt-20 px-4 text-center">
          <div className="inline-block px-4 py-1 mb-6 rounded-full border border-anime-accent/50 bg-anime-accent/10 text-anime-accent text-sm font-bold animate-pulse">
            🎌 For Anime Fans Only
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Learn Japanese <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-anime-warning to-anime-accent">
              The Shonen Way
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mb-10">
            Forget boring textbooks. Learn the language of Naruto. 
            Real anime dialogues, infinite AI roleplay.
          </p>
          <button onClick={handleLogin} className="bg-gradient-to-r from-anime-accent to-purple-600 px-10 py-4 rounded-xl font-bold text-xl hover:shadow-[0_0_30px_rgba(244,114,182,0.6)] transition transform hover:-translate-y-1">
            Start Your Training ⚔️
          </button>

          {/* Legal Footer */}
          <footer className="mt-20 text-gray-500 text-sm flex gap-4">
             <a href="#" className="hover:text-white">Privacy</a>
             <a href="#" className="hover:text-white">Terms</a>
          </footer>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD
  if (!mode) {
    return (
      <div className="min-h-screen bg-anime-bg text-white p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">
            Welcome back, <span className="text-anime-primary">{session.user.user_metadata.full_name || "Shinobi"}</span>-san!
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
          <button onClick={() => setMode('chat')} className="group relative bg-anime-card border border-anime-primary/30 p-8 rounded-2xl hover:bg-anime-card/80 transition text-left overflow-hidden">
             <MessageCircle size={40} className="text-anime-primary mb-4" />
             <h2 className="text-2xl font-bold mb-2">Free Chat Mode</h2>
             <p className="text-gray-400">Talk to FlowSensei about any anime.</p>
          </button>

          <button onClick={() => setMode('lessons')} className="group relative bg-anime-card border border-anime-accent/30 p-8 rounded-2xl hover:bg-anime-card/80 transition text-left overflow-hidden">
             <BookOpen size={40} className="text-anime-accent mb-4" />
             <h2 className="text-2xl font-bold mb-2">Structured Path</h2>
             <p className="text-gray-400">Follow the "Way of the Ninja" curriculum.</p>
          </button>
        </div>
        
        <button onClick={handleLogout} className="mt-8 text-gray-500 hover:text-white text-sm flex gap-2 items-center">
            <LogOut size={16}/> Log Out
        </button>
      </div>
    );
  }

  // 3. CHAT INTERFACE
  return (
    <div className="flex h-screen bg-anime-bg text-white font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-anime-bg/90 backdrop-blur border-b border-white/5 p-4 flex justify-between items-center z-50">
        <div className="font-bold text-anime-primary">FlowCraft</div>
        <button onClick={() => setMode(null)} className="text-xs bg-white/10 px-3 py-1 rounded">Menu</button>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="w-72 bg-anime-card border-r border-white/5 hidden md:flex flex-col p-4">
        <div className="font-black text-xl tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-anime-primary to-anime-accent cursor-pointer" onClick={() => setMode(null)}>
          FlowCraftLang
        </div>
        {/* Quest Log content... */}
        <div className="mt-auto pt-4 border-t border-white/5">
           <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
             <ChevronRight className="rotate-180" size={16}/> Back to Menu
           </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative pt-16 md:pt-0">
        <div className="h-16 border-b border-white/5 hidden md:flex items-center px-6 justify-between bg-anime-bg/50 backdrop-blur z-10">
          <h2 className="font-bold text-lg">
            {mode === 'chat' ? 'Free Chat Mode 💬' : `Training Level ${currentLesson} ⚔️`}
          </h2>
          {userTier === 'free' && <button onClick={openLemonSqueezy} className="text-xs bg-anime-warning text-black px-3 py-1 rounded font-bold">UPGRADE</button>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-4xl mb-4">🎌</p>
              <p>Say "Osu!" or "Konnichiwa" to start!</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-2xl p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-anime-primary text-black font-medium rounded-tr-none' 
                  : 'bg-anime-card border border-white/10 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'assistant' && (
                   <button 
                     onClick={() => speak(msg.content)}
                     className="mt-2 text-xs opacity-70 hover:opacity-100 flex items-center gap-1 bg-black/20 px-2 py-1 rounded"
                   >
                     <Volume2 size={12}/> Pronounce
                   </button>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-anime-accent animate-pulse pl-4">Sensei is writing... ✍️</div>}
          <div ref={scrollRef}/>
        </div>

        <div className="p-4 border-t border-white/5 bg-anime-bg">
          <div className="max-w-4xl mx-auto relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full bg-anime-card border border-white/10 rounded-full py-3 px-5 pr-12 focus:outline-none focus:border-anime-primary text-white placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="absolute right-2 top-1.5 p-2 bg-anime-primary rounded-full text-black hover:bg-cyan-300 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}