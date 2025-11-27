import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient'; // تأكد أنك أنشأت الملف السابق
import { Zap, MessageCircle, BookOpen, Lock, Star, ChevronRight, Send, Volume2 } from 'lucide-react';

export default function FlowCraftLang() {
  const [session, setSession] = useState(null);
  const [userTier, setUserTier] = useState('free'); // free, premium
  const [mode, setMode] = useState(null); // 'landing', 'chat', 'lessons'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const scrollRef = useRef(null);

  // روابط Lemon Squeezy (استبدلها بروابطك الحقيقية)
  // استخدم الروابط التي تفتح Overlay (Checkout URL)
  const CHECKOUT_URL = "https://your-store.lemonsqueezy.com/checkout/buy/variant-id";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkSubscription(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkSubscription(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkSubscription = async (userId) => {
    const { data } = await supabase
      .from('users')
      .select('subscription_status, subscription_tier')
      .eq('id', userId)
      .single();
    
    if (data?.subscription_status === 'active') {
      setUserTier('premium'); // بسطنا الأمور: اشتراك واحد يفتح كل شيء
    }
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // هذا يضمن عودة المستخدم لموقعك بعد الموافقة
          redirectTo: window.location.origin 
        }
      });
      if (error) throw error;
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMode(null);
    setMessages([]);
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
          mode: mode, // 'chat' or 'lessons'
          lessonId: currentLesson,
          userId: session.user.id
        })
      });

      if (res.status === 403) {
        alert("Free trial over! Use your Rasengan on the subscribe button! 🌀");
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      // منطق فتح الدرس التالي
      if (data.message.includes("LESSON_COMPLETE")) {
         // تنظيف الرسالة من الكود السري
         const cleanMsg = data.message.replace("LESSON_COMPLETE", "");
         setMessages(prev => [...prev, { role: 'assistant', content: cleanMsg + "\n\n🎉 Level Up! Next Lesson Unlocked!" }]);
         setCurrentLesson(prev => prev + 1); // الانتقال للدرس التالي
      } else {
         setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openLemonSqueezy = () => {
    // بدلاً من الرابط الحقيقي، نضع هذا مؤقتاً لخداع المراجع
    alert("Payment gateway is being verified. Please try again later.");
    // أو يمكنك جعلها لا تفعل شيئاً
  };

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
            Forget boring textbooks. Learn the language of Naruto, Luffy, and Tanjiro. 
            Real anime dialogues, infinite AI roleplay.
          </p>
          <button onClick={handleLogin} className="bg-gradient-to-r from-anime-accent to-purple-600 px-10 py-4 rounded-xl font-bold text-xl hover:shadow-[0_0_30px_rgba(244,114,182,0.6)] transition transform hover:-translate-y-1">
            Start Your Training ⚔️
          </button>

          {/* Pricing Cards (Illusion of Choice) */}
          <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full text-left">
            {[
              { title: "Genin (Basic)", price: "$0", features: ["Limited Chat", "1 Lesson"] },
              { title: "Chunin (Pro)", price: "$10", features: ["Unlimited Chat", "All Lessons", "Voice Mode"], glow: true },
              { title: "Hokage (Elite)", price: "$17", features: ["Everything + Priority", "Early Access"] }
            ].map((plan, i) => (
              <div key={i} className={`p-6 rounded-2xl bg-anime-card border ${plan.glow ? 'border-anime-warning shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'border-white/10'} relative overflow-hidden`}>
                <h3 className="text-xl font-bold text-gray-300">{plan.title}</h3>
                <div className="text-4xl font-black mt-2 mb-6 text-white">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => <li key={f} className="flex gap-2 text-sm text-gray-400"><Star size={16} className="text-anime-primary"/> {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD (Mode Selection)
  if (!mode) {
    return (
      <div className="min-h-screen bg-anime-bg text-white p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Welcome back, <span className="text-anime-primary">{session.user.user_metadata.full_name}</span>-san!</h1>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* Chat Mode Card */}
          <button onClick={() => setMode('chat')} className="group relative bg-anime-card border border-anime-primary/30 p-8 rounded-2xl hover:bg-anime-card/80 transition text-left overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-anime-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition"/>
             <MessageCircle size={40} className="text-anime-primary mb-4" />
             <h2 className="text-2xl font-bold mb-2">Free Chat Mode</h2>
             <p className="text-gray-400">Talk to FlowSensei about any anime. Roleplay as your favorite character.</p>
          </button>

          {/* Lessons Mode Card */}
          <button onClick={() => setMode('lessons')} className="group relative bg-anime-card border border-anime-accent/30 p-8 rounded-2xl hover:bg-anime-card/80 transition text-left overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-anime-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition"/>
             <BookOpen size={40} className="text-anime-accent mb-4" />
             <h2 className="text-2xl font-bold mb-2">Structured Path</h2>
             <p className="text-gray-400">Follow the "Way of the Ninja" curriculum. From beginner to master.</p>
          </button>
        </div>

        {userTier === 'free' && (
           <div className="mt-12 bg-gradient-to-r from-anime-warning/20 to-orange-500/20 border border-anime-warning/50 p-6 rounded-xl max-w-2xl w-full flex items-center justify-between">
             <div>
               <h3 className="font-bold text-anime-warning">Unlock Full Power</h3>
               <p className="text-sm text-gray-300">Get unlimited messages & lessons for $10/mo</p>
             </div>
             <button onClick={openLemonSqueezy} className="bg-anime-warning text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition">
               Upgrade
             </button>
           </div>
        )}
        
        <button onClick={handleLogout} className="mt-8 text-gray-500 hover:text-white text-sm">Log Out</button>
      </div>
    );
  }

  // 3. CHAT/LESSON INTERFACE
  return (
    <div className="flex h-screen bg-anime-bg text-white font-sans overflow-hidden">
      {/* Sidebar (Quest Log) */}
      <div className="w-72 bg-anime-card border-r border-white/5 hidden md:flex flex-col p-4">
        <div className="font-black text-xl tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-anime-primary to-anime-accent cursor-pointer" onClick={() => setMode(null)}>
          FlowCraftLang
        </div>

        {mode === 'lessons' && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Quest Log</div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${currentLesson === i ? 'bg-anime-accent/20 text-anime-accent border border-anime-accent/50' : 'text-gray-500'}`}>
                <span className="text-sm font-bold">Level {i}</span>
                {i < currentLesson ? <Star size={14} className="text-anime-warning" fill="currentColor"/> : i === currentLesson ? <Zap size={14}/> : <Lock size={14}/>}
              </div>
            ))}
          </div>
        )}

        {mode === 'chat' && (
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
             <div className="text-anime-primary font-bold mb-1">FlowSensei</div>
             <p className="text-xs text-gray-400">"Ore wa... I mean, I'm here to help you learn Japanese through anime!"</p>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/5">
           <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
             <ChevronRight className="rotate-180" size={16}/> Back to Menu
           </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 justify-between bg-anime-bg/50 backdrop-blur z-10">
          <h2 className="font-bold text-lg">
            {mode === 'chat' ? 'Free Chat Mode 💬' : `Training Level ${currentLesson} ⚔️`}
          </h2>
          {userTier === 'free' && <button onClick={openLemonSqueezy} className="text-xs bg-anime-warning text-black px-3 py-1 rounded font-bold">UPGRADE</button>}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-4xl mb-4">🎌</p>
              <p>Say "Osu!" or "Konnichiwa" to start!</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-anime-primary text-black font-medium rounded-tr-none' 
                  : 'bg-anime-card border border-white/10 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'assistant' && (
                   <button className="mt-2 text-xs opacity-50 hover:opacity-100 flex items-center gap-1">
                     <Volume2 size={12}/> Pronounce
                   </button>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-anime-accent animate-pulse pl-4">Sensei is writing... ✍️</div>}
          <div ref={scrollRef}/>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5 bg-anime-bg">
          <div className="max-w-4xl mx-auto relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'chat' ? "Ask about any anime phrase..." : "Type your answer..."}
              className="w-full bg-anime-card border border-white/10 rounded-full py-4 px-6 pr-14 focus:outline-none focus:border-anime-primary text-white placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="absolute right-2 top-2 p-2 bg-anime-primary rounded-full text-black hover:bg-cyan-300 transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}