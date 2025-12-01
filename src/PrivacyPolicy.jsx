import React from 'react';
import { ChevronLeft, Lock, Server, Eye } from 'lucide-react';

export const PrivacyPolicy = ({ setView }) => (
  <div className="min-h-screen bg-[#050505] anime-grid-bg text-white p-6 font-sans relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>

    <div className="max-w-4xl mx-auto relative z-10">
      <button 
        onClick={() => setView('home')} 
        className="group flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 font-bold"
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition" size={20}/> Back to Dojo
      </button>

      <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <h1 className="text-5xl md:text-6xl font-manga mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          Privacy Protocol
        </h1>
        <p className="text-gray-400 mb-10 font-mono text-sm border-b border-white/10 pb-6">
          Security Clearance: Level 1 | Updated: Dec 2025
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <Lock className="mx-auto text-emerald-400 mb-2" size={24}/>
                <h3 className="font-bold mb-1">Encrypted</h3>
                <p className="text-xs text-gray-400">Data via SSL</p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <Server className="mx-auto text-emerald-400 mb-2" size={24}/>
                <h3 className="font-bold mb-1">Secure DB</h3>
                <p className="text-xs text-gray-400">Hosted on Supabase</p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                <Eye className="mx-auto text-emerald-400 mb-2" size={24}/>
                <h3 className="font-bold mb-1">No Selling</h3>
                <p className="text-xs text-gray-400">We don't sell data</p>
            </div>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Data We Collect</h2>
            <p>
              We act as a minimalist data collector. We only store what is strictly necessary for your training progress:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-400">
                <li>Authentication ID (via Supabase Auth)</li>
                <li>Email Address (for login & essential updates)</li>
                <li>Chat History (to maintain context with AI Sensei)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Third-Party Intelligence</h2>
            <p>
              Your messages are processed by **Groq AI** solely to generate responses. We do not use your personal conversations to train public AI models. Payments are handled securely by **Paddle/NowPayments**; we never touch your credit card numbers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Data Deletion (The Ninja Vanish)</h2>
            <p>
              You have the right to disappear. If you wish to delete your account and all associated data, please contact support. We will wipe your records from our database permanently.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
);
