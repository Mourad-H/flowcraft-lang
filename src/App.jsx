import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Zap, MessageCircle, BookOpen, Lock, Star, ChevronRight, Send, Volume2, LogOut } from 'lucide-react';
import { PrivacyPolicy } from './PrivacyPolicy';
import { RefundPolicy } from './RefundPolicy';

export default function FlowCraftLang() {
  // ==========================================
  // 1. ALL STATES (الحالات)
  // ==========================================
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userTier, setUserTier] = useState('free');
  const [mode, setMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [view, setView] = useState('home');
  const [msgCount, setMsgCount] = useState(0); // عداد الرسائل
  
  // Auth Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  
  const scrollRef = useRef(null);

  // ==========================================
  // 2. HELPER FUNCTIONS (الدوال)
  // ==========================================

  // دالة جلب الإحصائيات (جديد أم قديم + عدد رسائل اليوم)
  const fetchUsageStats = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
        // 1. هل هو جديد؟
        const { count: totalCount } = await supabase
            .from('conversations')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId);
        
        setIsNewUser(totalCount === 0);

        // 2. كم رسالة اليوم؟
        const { count: todayCount } = await supabase
            .from('conversations')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', today)
            .eq('role', 'user');

        setMsgCount(todayCount || 0);

    } catch (err) {
        console.error("Stats fetch error:", err);
    }
  };

  const checkSubscription = async (userId) => {
    if (!userId) { setUserTier('free'); return; }
    
    const { data: userData, error } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') { setUserTier('free'); return; }

    if (userData) {
        setUserTier(userData.subscription_status || 'free');
    } else {
        try {
            await supabase.from('users').insert([{ id: userId, subscription_status: 'free' }]).select(); 
            setUserTier('free');
        } catch (insertError) {
            setUserTier('free');
        }
    }
  };

  const handleAuthSubmit = async (isSignUp) => {
      if (!email || !password) return;
      setLoading(true);
      setAuthMessage('');

      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) {
          setAuthMessage(result.error.message);
      } else if (isSignUp) {
        setAuthMessage("Signup successful! Please check your email for confirmation.");
      }
      setLoading(false);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMode(null);
    setMessages([]);
    setSession(null);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    window.speechSynthesis.cancel();
    
    const voices = window.speechSynthesis.getVoices();
    const japanVoice = voices.find(v => (v.name.includes("Google") || v.name.includes("Microsoft")) && v.lang.includes("ja")) || 
                       voices.find(v => v.lang === 'ja-JP');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (japanVoice) { utterance.voice = japanVoice; utterance.lang = 'ja-JP'; } else { utterance.lang = 'ja-JP'; }
    utterance.rate = 1.0; utterance.pitch = 1.1;
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
      if (!res.ok || data.error) throw new Error(data.error || "Server Error");

      // تحديث العداد محلياً فوراً
      setMsgCount(prev => prev + 1);

      const aiMsgContent = data.message || "Error: No response";
      
      if (aiMsgContent.includes("LESSON_COMPLETE")) {
         const cleanMsg = aiMsgContent.replace("LESSON_COMPLETE", "");
         setMessages(prev => [...prev, { role: 'assistant', content: cleanMsg + "\n\n🎉 Level Up!" }]);
         setCurrentLesson(prev => currentLesson + 1);
         speak(cleanMsg);
      } else {
         setMessages(prev => [...prev, { role: 'assistant', content: aiMsgContent }]);
      }
    } catch (err) {
      let errorMessage = err.message || "Unknown Error";
      if (errorMessage.includes("LIMIT_EXCEEDED")) {
          alert("LIMIT EXCEEDED: Your 3 free messages are done for today! Upgrade to Premium to continue your training. ⚔️");
          setMsgCount(3); // تأكيد القفل في الواجهة
      } else if (errorMessage.includes("Server Error") || errorMessage.includes("Groq API Error")) {
          alert("SYSTEM ERROR: AI service unavailable. Try again later.");
      } else {
          alert("Error: " + errorMessage); 
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoUpgrade = async (tier = 'premium') => {
    if (!session?.user?.id) { alert("Please log in first."); return; }
    setLoading(true);
    try {
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, tier: tier })
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Invoice creation failed.');
      window.location.href = data.invoice_url;
    } catch (error) {
      alert("Error creating invoice: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3. EFFECTS
  // ==========================================

  useEffect(() => {
    const handleAuthCheck = async (currentSession) => {
      try {
        if (currentSession?.user) {
          await Promise.all([
             checkSubscription(currentSession.user.id),
             fetchUsageStats(currentSession.user.id)
          ]);
        }
      } catch (err) {
        console.error("Auth Check Error:", err);
      } finally {
        setAuthLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) handleAuthCheck(session);
      else setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) handleAuthCheck(session);
      else setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ==========================================
  // 4. RENDERING
  // ==========================================

  // A. Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-anime-bg flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-anime-primary mb-4"></div>
        <p className="text-xl font-bold animate-pulse">Loading Chakra... 🌀</p>
      </div>
    );
  }

  // B. Legal Pages
  if (view === 'privacy') return <PrivacyPolicy setView={setView} />;
  if (view === 'refund') return <RefundPolicy setView={setView} />;

  // C. Auth Screen (Landing Page)
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
          <button 
             onClick={() => setIsLoginView(!isLoginView)} 
             className="bg-white text-anime-bg px-6 py-2 rounded-full font-bold hover:scale-105 transition"
          >
            {isLoginView ? 'Sign Up' : 'Log In'}
          </button>
        </nav>

        <div className="flex flex-col items-center justify-center mt-20 px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Learn Japanese <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-anime-warning to-anime-accent">
              The Shonen Way
            </span>
          </h1>
          
          <div className="max-w-md w-full mt-10 p-6 bg-anime-card rounded-xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">{isLoginView ? 'Log In' : 'Create Account'}</h2>
            
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg text-black focus:ring-anime-primary outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg text-black focus:ring-anime-primary outline-none"
              />
              <button 
                onClick={() => handleAuthSubmit(!isLoginView)} 
                disabled={loading || !email || !password}
                className="bg-anime-primary text-black font-bold py-3 rounded-lg hover:bg-cyan-400 transition"
              >
                {loading ? 'Processing...' : (isLoginView ? 'Log In' : 'Sign Up')} 🚀
              </button>
              {authMessage && <p className="text-red-400 text-sm mt-2">{authMessage}</p>}
            </div>
          </div>

          <footer className="mt-20 text-gray-500 text-sm flex gap-4">
            <button onClick={() => setView('privacy')} className="hover:text-white">Privacy</button>
            <button onClick={() => setView('refund')} className="hover:text-white">Terms</button>
          </footer>
        </div>
      </div>
    );
  }

  // D. Dashboard (مع الـ Footer القانوني)
  if (!mode) {
    const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || "Shinobi";
    const messagesLeft = Math.max(0, 3 - msgCount); 

    return (
      <div className="min-h-screen bg-anime-bg text-white p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">
            {isNewUser ? "Welcome to the Dojo! 🥋" : "Welcome back, "}
            <span className="text-anime-primary">{userName}</span>-san!
        </h1>
        
        {/* PAYWALL BANNER */}
        {userTier === 'free' && (
            <div className={`mb-8 p-6 rounded-xl max-w-4xl w-full flex flex-col md:flex-row justify-between items-center shadow-lg border-2 gap-4 text-center md:text-left ${
                msgCount >= 3 
                ? "bg-gradient-to-r from-red-900/50 to-red-600/20 border-red-500" 
                : "bg-gradient-to-r from-green-900/50 to-emerald-600/20 border-green-500" 
            }`}>
                <div>
                    <p className={`text-lg font-bold ${msgCount >= 3 ? "text-red-400" : "text-green-400"}`}>
                        {msgCount >= 3 ? "Daily Limit Reached ⛔" : "Free Training Active ✅"}
                    </p>
                    <p className="text-sm text-gray-300">
                        {msgCount >= 3 
                            ? "You used all 3 free messages. Upgrade for unlimited power!" 
                            : `You have ${messagesLeft} free messages left for today.`}
                    </p>
                </div>
                <button 
                    onClick={() => handleCryptoUpgrade('premium')} 
                    className="bg-anime-warning text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition shrink-0"
                >
                    {msgCount >= 3 ? "Unlock Unlimited 🔓" : "Go Premium ⭐"}
                </button>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
          <button 
            onClick={() => setMode('chat')} 
            disabled={userTier === 'free' && msgCount >= 3} 
            className={`group relative p-8 rounded-2xl transition text-left overflow-hidden ${
                userTier === 'free' && msgCount >= 3 
                ? 'bg-anime-card/50 border-white/10 opacity-50 cursor-not-allowed' 
                : 'bg-anime-card border border-anime-primary/30 hover:border-anime-accent'
            }`}
          >
             <MessageCircle size={40} className="text-anime-primary mb-4" />
             <h2 className="text-2xl font-bold mb-2">Free Chat Mode</h2>
             <p className="text-gray-400">Talk to FlowSensei about any anime.</p>
             {userTier === 'free' && msgCount >= 3 && <Lock className="absolute top-2 right-2 text-red-400" size={24} />} 
          </button>

          <button 
            onClick={() => setMode('lessons')} 
            disabled={userTier === 'free' && msgCount >= 3}
            className={`group relative p-8 rounded-2xl transition text-left overflow-hidden ${
                userTier === 'free' && msgCount >= 3 
                ? 'bg-anime-card/50 border-white/10 opacity-50 cursor-not-allowed' 
                : 'bg-anime-card border border-anime-accent/30 hover:border-anime-accent'
            }`}
          >
             <BookOpen size={40} className="text-anime-accent mb-4" />
             <h2 className="text-2xl font-bold mb-2">Structured Path</h2>
             <p className="text-gray-400">Follow the "Way of the Ninja" curriculum.</p>
             {userTier === 'free' && msgCount >= 3 && <Lock className="absolute top-2 right-2 text-red-400" size={24} />} 
          </button>
        </div>
        
        <button onClick={handleLogout} className="mt-8 text-gray-500 hover:text-white text-sm flex gap-2 items-center">
            <LogOut size={16}/> Log Out
        </button>

        {/* ✅ FOOTER IS HERE TOO */}
        <footer className="mt-12 text-gray-600 text-xs flex gap-6">
            <button onClick={() => setView('privacy')} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => setView('refund')} className="hover:text-white transition">Refund Policy</button>
            <a href="mailto:support@flowcraftco.com" className="hover:text-white transition">Contact Support</a>
        </footer>
      </div>
    );
  }

  // E. Chat Interface
  return (
    <div className="flex h-screen bg-anime-bg text-white font-sans overflow-hidden">
      <div className="md:hidden fixed top-0 w-full bg-anime-bg/90 backdrop-blur border-b border-white/5 p-4 flex justify-between items-center z-50">
        <div className="font-bold text-anime-primary">FlowCraft</div>
        <button onClick={() => setMode(null)} className="text-xs bg-white/10 px-3 py-1 rounded">Menu</button>
      </div>
      <div className="w-72 bg-anime-card border-r border-white/5 hidden md:flex flex-col p-4">
        <div className="font-black text-xl tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-anime-primary to-anime-accent cursor-pointer" onClick={() => setMode(null)}>FlowCraftLang</div>
        <div className="mt-auto pt-4 border-t border-white/5">
           <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2"><ChevronRight className="rotate-180" size={16}/> Back to Menu</button>
        </div>
      </div>
      <div className="flex-1 flex flex-col relative pt-16 md:pt-0">
        <div className="h-16 border-b border-white/5 hidden md:flex items-center px-6 justify-between bg-anime-bg/50 backdrop-blur z-10">
          <h2 className="font-bold text-lg">{mode === 'chat' ? 'Free Chat Mode 💬' : `Training Level ${currentLesson} ⚔️`}</h2>
          {userTier === 'free' && <button onClick={() => handleCryptoUpgrade('premium')} className="text-xs bg-anime-warning text-black px-3 py-1 rounded font-bold">UPGRADE</button>}
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
              <div className={`max-w-[85%] md:max-w-2xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-anime-primary text-black font-medium rounded-tr-none' : 'bg-anime-card border border-white/10 rounded-tl-none'}`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'assistant' && (
                   <button onClick={() => speak(msg.content)} className="mt-2 text-xs opacity-70 hover:opacity-100 flex items-center gap-1 bg-black/20 px-2 py-1 rounded"><Volume2 size={12}/> Pronounce</button>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-anime-accent animate-pulse pl-4">Sensei is writing... ✍️</div>}
          <div ref={scrollRef}/>
        </div>
        <div className="p-4 border-t border-white/5 bg-anime-bg">
          <div className="max-w-4xl mx-auto relative">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="w-full bg-anime-card border border-white/10 rounded-full py-3 px-5 pr-12 focus:outline-none focus:border-anime-primary text-white placeholder-gray-500" />
            <button onClick={handleSend} disabled={loading} className="absolute right-2 top-1.5 p-2 bg-anime-primary rounded-full text-black hover:bg-cyan-300 transition disabled:opacity-50"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
