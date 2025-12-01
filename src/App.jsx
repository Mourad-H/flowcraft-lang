import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Zap, MessageCircle, BookOpen, Lock, Star, ChevronRight, Send, Volume2, LogOut } from 'lucide-react';
import { PrivacyPolicy } from './PrivacyPolicy';
import { RefundPolicy } from './RefundPolicy';

export default function FlowCraftLang() {
  // ==========================================
  // 1. ALL STATES
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
  const [msgCount, setMsgCount] = useState(0);
  
  // 💰 Billing State (New)
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  // Auth Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  
  const scrollRef = useRef(null);

  // ==========================================
  // 2. HELPER FUNCTIONS
  // ==========================================

  const fetchUsageStats = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const { count: totalCount } = await supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('user_id', userId);
        setIsNewUser(totalCount === 0);
        const { count: todayCount } = await supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', today).eq('role', 'user');
        setMsgCount(todayCount || 0);
    } catch (err) { console.error("Stats fetch error:", err); }
  };

  const checkSubscription = async (userId) => {
    if (!userId) { setUserTier('free'); return; }
    const { data: userData, error } = await supabase.from('users').select('subscription_status, subscription_tier').eq('id', userId).single();
    if (error && error.code !== 'PGRST116') { setUserTier('free'); return; }
    if (userData && userData.subscription_status === 'active') {
        setUserTier(userData.subscription_tier || 'premium');
    } else {
        if (!userData) { try { await supabase.from('users').insert([{ id: userId, subscription_status: 'free' }]).select(); } catch (e) {} }
        setUserTier('free');
    }
  };

  const handleAuthSubmit = async (isSignUp) => {
      if (!email || !password) return;
      setLoading(true); setAuthMessage('');
      let result;
      if (isSignUp) result = await supabase.auth.signUp({ email, password });
      else result = await supabase.auth.signInWithPassword({ email, password });
      
      if (result.error) setAuthMessage(result.error.message);
      else if (isSignUp) setAuthMessage("Signup successful! Please check your email for confirmation.");
      setLoading(false);
  };
  
  const handleLogout = async () => { await supabase.auth.signOut(); setMode(null); setMessages([]); setSession(null); };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const japanVoice = voices.find(v => (v.name.includes("Google") || v.name.includes("Microsoft")) && v.lang.includes("ja")) || voices.find(v => v.lang === 'ja-JP');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (japanVoice) { utterance.voice = japanVoice; utterance.lang = 'ja-JP'; } else { utterance.lang = 'ja-JP'; }
    utterance.rate = 1.0; utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], mode: mode, lessonId: currentLesson, userId: session?.user?.id })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Server Error");
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
          setMsgCount(3);
      } else if (errorMessage.includes("Server Error") || errorMessage.includes("Groq API Error")) {
          alert("SYSTEM ERROR: AI service unavailable.");
      } else { alert("Error: " + errorMessage); }
    } finally { setLoading(false); }
  };

  // ✅ Updated Payment Logic with Cycle & Specific Pricing
  const handleCryptoUpgrade = async (tier) => {
    if (!session?.user?.id) { alert("Please log in first."); return; }
    
    // Calculate display price for confirmation
    let priceDisplay = "";
    if (billingCycle === 'yearly') {
        priceDisplay = tier === 'premium' ? "$140 (Yearly)" : "$84 (Yearly)";
    } else {
        priceDisplay = tier === 'premium' ? "$17 (Monthly)" : "$10 (Monthly)";
    }
    
    if(!window.confirm(`Start training with ${tier.toUpperCase()} for ${priceDisplay}?`)) return;

    setLoading(true);
    try {
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userId: session.user.id, 
            tier: tier, 
            cycle: billingCycle 
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Invoice creation failed.');
      window.location.href = data.invoice_url;
    } catch (error) {
      alert("Error creating invoice: " + error.message);
    } finally { setLoading(false); }
  };

  // ==========================================
  // 3. EFFECTS
  // ==========================================

  useEffect(() => {
    const handleAuthCheck = async (currentSession) => {
      try {
        if (currentSession?.user) {
          await Promise.all([ checkSubscription(currentSession.user.id), fetchUsageStats(currentSession.user.id) ]);
        }
      } catch (err) { console.error("Auth Check Error:", err); } finally { setAuthLoading(false); }
    };
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session) handleAuthCheck(session); else setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); if (session) handleAuthCheck(session); else setAuthLoading(false); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ==========================================
  // 4. RENDERING (Cyberpunk Style 🎨)
  // ==========================================

  // LOADING
  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-anime-accent shadow-[0_0_20px_#f472b6]"></div></div>;
  
  // LEGAL PAGES (With Neon Glows)
  if (view === 'privacy') return <PrivacyPolicy setView={setView} />;
  if (view === 'refund') return <RefundPolicy setView={setView} />;

  // LANDING PAGE
  if (!session) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans anime-grid-bg relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#050505] pointer-events-none"></div>
        
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-3xl font-manga tracking-wider transform hover:scale-105 transition cursor-pointer">
            <Zap className="text-anime-warning drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" fill="currentColor" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-anime-primary to-anime-accent neon-text">FlowCraft</span>
          </div>
          <button onClick={() => setIsLoginView(!isLoginView)} className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-2 rounded-full font-bold hover:bg-anime-accent hover:border-anime-accent hover:shadow-[0_0_20px_#f472b6] transition duration-300">
            {isLoginView ? 'Join Now' : 'Log In'}
          </button>
        </nav>

        <div className="flex flex-col items-center justify-center mt-16 px-4 text-center relative z-10">
          <div className="inline-block px-6 py-2 mb-6 rounded-full border border-anime-primary/50 bg-anime-primary/10 text-anime-primary text-sm font-bold tracking-widest uppercase animate-pulse">
            🎌 Protocol: Shonen Activated
          </div>
          <h1 className="text-6xl md:text-8xl font-manga mb-6 leading-tight drop-shadow-2xl">
            Learn Japanese <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-anime-warning to-orange-500">The Shonen Way</span>
          </h1>
          
          <div className="max-w-md w-full mt-10 p-8 bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(56,189,248,0.2)]">
            <h2 className="text-2xl font-bold mb-6 text-white">{isLoginView ? 'Initialize Link' : 'New Recruit'}</h2>
            <div className="flex flex-col gap-4">
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-anime-primary focus:shadow-[0_0_15px_rgba(56,189,248,0.5)] outline-none transition" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-anime-accent focus:shadow-[0_0_15px_rgba(244,114,182,0.5)] outline-none transition" />
              <button onClick={() => handleAuthSubmit(!isLoginView)} disabled={loading || !email || !password} className="w-full bg-gradient-to-r from-anime-primary to-blue-600 text-black font-black text-lg py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition shadow-lg shadow-blue-500/30">
                {loading ? 'Processing...' : (isLoginView ? 'ENTER SYSTEM 🚀' : 'START JOURNEY ⚔️')}
              </button>
              {authMessage && <p className="text-anime-accent text-sm mt-2 font-bold bg-anime-accent/10 p-2 rounded">{authMessage}</p>}
            </div>
          </div>
          
          {/* Footer with Neon Effect */}
          <footer className="mt-20 flex gap-8">
            <button onClick={() => setView('privacy')} className="text-neon-white text-xs font-bold tracking-widest uppercase hover:text-white transition">Privacy Protocol</button>
            <button onClick={() => setView('refund')} className="text-neon-white text-xs font-bold tracking-widest uppercase hover:text-white transition">Refund Rules</button>
          </footer>
        </div>
      </div>
    );
  }

  // DASHBOARD
  if (!mode) {
    const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || "Shinobi";
    const messagesLeft = Math.max(0, 3 - msgCount);
    
    // Check specific access
    const hasChatAccess = userTier === 'premium' || userTier === 'chat';
    const hasLessonsAccess = userTier === 'premium' || userTier === 'lessons';
    const isFree = userTier === 'free';

    return (
      <div className="min-h-screen bg-[#050505] anime-grid-bg text-white p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-manga mb-2 text-center">
            {isNewUser ? "Welcome to the Dojo! 🥋" : "Okaeri, "} 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-anime-primary to-anime-accent ml-2">{userName}</span>-san!
        </h1>
        
        {/* 🔥 THE SMOOTH SLIDING TOGGLE 🔥 */}
        <div className="relative flex items-center bg-gray-900/80 backdrop-blur border border-white/10 rounded-full p-1 mb-10 w-64 h-12 shadow-2xl cursor-pointer">
            <div className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-anime-accent to-purple-600 rounded-full transition-all duration-300 ease-in-out shadow-[0_0_15px_#f472b6] ${billingCycle === 'yearly' ? 'translate-x-full' : 'translate-x-0'}`}></div>
            <button onClick={() => setBillingCycle('monthly')} className="w-1/2 relative z-10 font-bold text-sm transition-colors duration-300 text-center">Monthly</button>
            <button onClick={() => setBillingCycle('yearly')} className="w-1/2 relative z-10 font-bold text-sm transition-colors duration-300 text-center flex items-center justify-center gap-1">
                Yearly <span className="text-[9px] bg-white text-black px-1.5 rounded-sm font-black">-30%</span>
            </button>
        </div>

        {/* PAYWALL BANNER */}
        {isFree && (
            <div className={`mb-8 p-6 rounded-2xl max-w-4xl w-full flex flex-col md:flex-row justify-between items-center shadow-lg border-2 gap-4 text-center md:text-left transition-all duration-500 ${msgCount >= 3 ? "bg-red-900/20 border-red-500/50 shadow-red-500/20" : "bg-emerald-900/20 border-emerald-500/50 shadow-emerald-500/20"}`}>
                <div>
                    <p className={`text-xl font-manga tracking-wide ${msgCount >= 3 ? "text-red-400" : "text-emerald-400"}`}>
                        {msgCount >= 3 ? "⚠ DAILY LIMIT REACHED" : "✅ FREE TRAINING ACTIVE"}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                        {msgCount >= 3 ? "Your chakra is depleted. Upgrade to recharge immediately." : `You have ${messagesLeft} energy points left for today.`}
                    </p>
                </div>
                <button onClick={() => handleCryptoUpgrade('premium')} className="bg-anime-warning text-black font-black px-8 py-3 rounded-xl hover:scale-105 active:scale-95 transition shadow-[0_0_20px_#facc15] flex items-center gap-2">
                    <Star size={20} fill="black"/> UNLOCK ALL ({billingCycle === 'monthly' ? '$17' : '$140'})
                </button>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* Chat Card */}
          <button 
            onClick={() => hasChatAccess ? setMode('chat') : null}
            className={`group relative p-8 rounded-3xl text-left overflow-hidden transition-all duration-300 hover:-translate-y-2 ${hasChatAccess ? 'bg-[#1e293b]/50 border-2 border-anime-primary/50 hover:border-anime-primary hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]' : 'bg-gray-900/50 border border-white/5 grayscale opacity-80'}`}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-anime-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"/>
             <MessageCircle size={48} className="text-anime-primary mb-4" />
             <h2 className="text-3xl font-manga mb-2 text-white">Free Chat</h2>
             <p className="text-gray-400">Roleplay with AI Sensei. Talk about Anime, Manga, and Life.</p>
             {!hasChatAccess && (
                <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
                    <Lock className="text-red-500 drop-shadow-lg" size={28} />
                    <div onClick={(e) => { e.stopPropagation(); handleCryptoUpgrade('chat'); }} className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-xs font-bold text-white px-4 py-2 rounded-lg cursor-pointer transition">
                        Unlock ({billingCycle === 'monthly' ? '$10' : '$84'})
                    </div>
                </div>
             )} 
          </button>

          {/* Lessons Card */}
          <button 
            onClick={() => hasLessonsAccess ? setMode('lessons') : null}
            className={`group relative p-8 rounded-3xl text-left overflow-hidden transition-all duration-300 hover:-translate-y-2 ${hasLessonsAccess ? 'bg-[#1e293b]/50 border-2 border-anime-accent/50 hover:border-anime-accent hover:shadow-[0_0_30px_rgba(244,114,182,0.3)]' : 'bg-gray-900/50 border border-white/5 grayscale opacity-80'}`}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-anime-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"/>
             <BookOpen size={48} className="text-anime-accent mb-4" />
             <h2 className="text-3xl font-manga mb-2 text-white">The Path</h2>
             <p className="text-gray-400">Structured Ninja curriculum. From Genin basics to Kage fluency.</p>
             {!hasLessonsAccess && (
                <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
                    <Lock className="text-red-500 drop-shadow-lg" size={28} />
                    <div onClick={(e) => { e.stopPropagation(); handleCryptoUpgrade('lessons'); }} className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-xs font-bold text-white px-4 py-2 rounded-lg cursor-pointer transition">
                        Unlock ({billingCycle === 'monthly' ? '$10' : '$84'})
                    </div>
                </div>
             )} 
          </button>
        </div>
        
        {/* Logout & Footer with Neon Glow */}
        <button onClick={handleLogout} className="mt-12 text-neon-red text-sm flex gap-2 items-center font-bold tracking-wide transition"><LogOut size={18} className="drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"/> ABORT MISSION (LOG OUT)</button>
        <footer className="mt-10 mb-6 flex gap-8">
            <button onClick={() => setView('privacy')} className="text-neon-white text-xs font-bold tracking-widest uppercase">Privacy Protocol</button>
            <button onClick={() => setView('refund')} className="text-neon-white text-xs font-bold tracking-widest uppercase">Refund Rules</button>
            <a href="mailto:support@flowcraftco.com" className="text-neon-white text-xs font-bold tracking-widest uppercase">Comms Link</a>
        </footer>
      </div>
    );
  }

  // E. CHAT INTERFACE
  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <div className="md:hidden fixed top-0 w-full bg-[#050505]/90 backdrop-blur border-b border-white/10 p-4 flex justify-between items-center z-50">
        <div className="font-manga text-xl text-anime-primary tracking-widest">FlowCraft</div>
        <button onClick={() => setMode(null)} className="text-xs bg-white/10 px-3 py-1 rounded">Menu</button>
      </div>
      <div className="w-72 bg-[#1e293b]/30 border-r border-white/5 hidden md:flex flex-col p-6">
        <div className="font-manga text-2xl tracking-widest mb-10 text-transparent bg-clip-text bg-gradient-to-r from-anime-primary to-anime-accent cursor-pointer hover:opacity-80 transition" onClick={() => setMode(null)}>FlowCraft</div>
        <div className="mt-auto pt-6 border-t border-white/5">
           <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition"><ChevronRight className="rotate-180" size={16}/> Back to Dojo</button>
        </div>
      </div>
      <div className="flex-1 flex flex-col relative pt-16 md:pt-0">
        <div className="h-20 border-b border-white/5 hidden md:flex items-center px-8 justify-between bg-[#050505]/50 backdrop-blur z-10">
          <h2 className="font-bold text-xl">{mode === 'chat' ? '💬 Free Chat Mode' : `⚔️ Training Level ${currentLesson}`}</h2>
          {userTier !== 'premium' && <button onClick={() => handleCryptoUpgrade('premium')} className="text-xs bg-anime-warning text-black px-4 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_#facc15] transition">UPGRADE ALL</button>}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && <div className="text-center text-gray-500 mt-20"><p className="text-6xl mb-4 grayscale opacity-50">🎌</p><p className="font-manga text-xl">Say "Osu!" to begin.</p></div>}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-2xl p-5 rounded-2xl shadow-lg ${msg.role === 'user' ? 'bg-anime-primary text-black font-bold rounded-tr-none' : 'bg-[#1e293b] border border-white/10 rounded-tl-none'}`}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                {msg.role === 'assistant' && <button onClick={() => speak(msg.content)} className="mt-3 text-xs opacity-60 hover:opacity-100 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full transition"><Volume2 size={14}/> Listen</button>}
              </div>
            </div>
          ))}
          {loading && <div className="text-anime-accent animate-pulse pl-6 font-manga tracking-widest">SENSEI IS TYPING...</div>}
          <div ref={scrollRef}/>
        </div>
        <div className="p-6 border-t border-white/5 bg-[#050505]">
          <div className="max-w-4xl mx-auto relative">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="w-full bg-[#1e293b] border border-white/10 rounded-full py-4 px-6 pr-14 focus:outline-none focus:border-anime-primary focus:shadow-[0_0_20px_rgba(56,189,248,0.2)] text-white placeholder-gray-600 transition-all" />
            <button onClick={handleSend} disabled={loading} className="absolute right-2 top-2 p-2 bg-anime-primary rounded-full text-black hover:bg-cyan-300 hover:scale-110 transition disabled:opacity-50 disabled:scale-100"><Send size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
