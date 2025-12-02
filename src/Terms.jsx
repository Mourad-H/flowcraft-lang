import React from 'react';
import { ChevronLeft } from 'lucide-react';

export const Terms = ({ setView }) => (
  <div className="min-h-screen bg-[#050505] anime-grid-bg text-white p-6 font-sans relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>

    <div className="max-w-4xl mx-auto relative z-10">
      <button 
        onClick={() => setView('home')} 
        className="group flex items-center gap-2 text-gray-300 hover:text-white transition mb-8 font-bold"
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition" size={20}/> Back to Dojo
      </button>

      <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <h1 className="text-5xl md:text-6xl font-manga mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Terms & Conditions
        </h1>
        <p className="text-gray-300 mb-10 font-mono text-sm border-b border-white/10 pb-6">
          Last Update: December 1, 2025 <br/>
          <strong>Operator:</strong> Mourad Hamel (Sole Proprietor) <br/>
          <strong>Jurisdiction:</strong> Algeria
        </p>

        <div className="space-y-8 text-slate-200 leading-relaxed text-lg drop-shadow-md">
          <section>
            <h2 className="text-xl font-bold text-white mb-2 neon-text">1. Acceptance of Terms</h2>
            <p>By accessing FlowCraftLang, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2 neon-text">2. License & Access</h2>
            <p>We grant you a limited, non-exclusive, non-transferable license to use our AI-powered language learning tools for personal, non-commercial use.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2 neon-text">3. Subscriptions</h2>
            <p>Subscriptions are billed in advance on a monthly or yearly basis via our Merchant of Record (Paddle). You may cancel at any time to stop future billing.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2 neon-text">4. AI Usage Policy</h2>
            <p>Our service uses Artificial Intelligence. While we strive for accuracy, AI may occasionally generate incorrect information. Users should use their judgment.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
);
