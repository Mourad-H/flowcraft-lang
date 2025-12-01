import React from 'react';
import { ChevronLeft, ShieldAlert, CheckCircle } from 'lucide-react';

export const RefundPolicy = ({ setView }) => (
  <div className="min-h-screen bg-[#050505] anime-grid-bg text-white p-6 font-sans relative overflow-hidden">
    {/* تأثير ضبابي في الخلفية */}
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-anime-primary/10 to-transparent pointer-events-none"></div>

    <div className="max-w-4xl mx-auto relative z-10">
      <button 
        onClick={() => setView('home')} 
        className="group flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 font-bold"
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition" size={20}/> Back to Dojo
      </button>

      <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <h1 className="text-5xl md:text-6xl font-manga mb-2 text-transparent bg-clip-text bg-gradient-to-r from-anime-accent to-purple-500">
          Refund Policy
        </h1>
        <p className="text-gray-400 mb-10 font-mono text-sm border-b border-white/10 pb-6">
          Last Protocol Update: December 1, 2025
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-anime-primary">01.</span> The 14-Day Guarantee
            </h2>
            <p>
              We want you to train with confidence. We offer a full refund within **14 days** of your initial purchase, provided the "Fair Use" conditions are met.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-anime-primary">02.</span> Fair Use Conditions
            </h2>
            <div className="bg-black/30 p-6 rounded-xl border-l-4 border-anime-warning">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle className="text-anime-warning shrink-0" size={20}/>
                  <span>Request must be made within 14 calendar days.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-anime-warning shrink-0" size={20}/>
                  <span>Usage must not exceed **20 AI interactions** (messages sent). We pay for every AI token, so heavy usage consumes resources that cannot be refunded.</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-anime-primary">03.</span> How to Initiate
            </h2>
            <p className="mb-4">
              Send a signal to our support team. We process refunds via our Merchant of Record (Paddle/NowPayments).
            </p>
            <a href="mailto:support@flowcraftco.com" className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-lg text-anime-accent transition">
              Contact: support@flowcraftco.com
            </a>
          </section>
        </div>
      </div>
    </div>
  </div>
);
