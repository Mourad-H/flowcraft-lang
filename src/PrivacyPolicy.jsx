import React from 'react';
import { ChevronLeft, Lock, Server, Eye, ShieldAlert, FileText } from 'lucide-react';

export const PrivacyPolicy = ({ setView }) => (
  <div className="min-h-screen bg-[#050505] anime-grid-bg text-white p-4 md:p-6 font-sans relative overflow-x-hidden">
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>

    <div className="max-w-5xl mx-auto relative z-10">
      <button 
        onClick={() => setView('home')} 
        className="group flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 font-bold text-sm tracking-widest uppercase"
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition" size={16}/> Return to Base
      </button>

      <div className="bg-[#1e293b]/90 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-12 shadow-[0_0_100px_rgba(16,185,129,0.1)]">
        
        {/* Header Section */}
        <div className="border-b border-white/10 pb-8 mb-8">
            <h1 className="text-4xl md:text-6xl font-black font-manga mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 tracking-tighter">
            PRIVACY PROTOCOL
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><ShieldAlert size={12}/> Classification: Public</span>
                <span className="flex items-center gap-1"><FileText size={12}/> Ref: FLOW-PVY-2025-V9</span>
                <span>Last Updated: December 12, 2025</span>
            </div>
        </div>

        {/* Visual Summary (Still keeps the nice look) */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-emerald-500/30 transition duration-300">
                <Lock className="text-emerald-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">E2E Encryption</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">Data transmission secured via TLS 1.3 standards.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-emerald-500/30 transition duration-300">
                <Server className="text-emerald-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">Sovereign Data</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">Stored on Supabase with Row Level Security (RLS).</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-emerald-500/30 transition duration-300">
                <Eye className="text-emerald-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">Zero-Sale Policy</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">We do not monetize your personal metadata.</p>
            </div>
        </div>

        {/* 🛑 THE WALL OF TEXT (Legal Jargon Injection) */}
        <div className="space-y-10 text-slate-300 text-sm md:text-base leading-loose font-light text-justify">
          
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">01.</span> PREAMBLE AND SCOPE
            </h2>
            <p className="opacity-80">
              This Privacy Policy ("Policy") governs the collection, processing, and utilization of data by <strong>FlowCraft</strong> ("The Company," "We," "Us," or "Our") concerning users ("User," "You," or "Your") of our AI-driven language learning interface (the "Service"). By accessing the Service, you unequivocally consent to the data practices described herein. This document adheres to international data sovereignty principles but is fundamentally governed by the internal regulations of The Company. We reserve the right to amend this Policy at any time without direct prior notice; your continued use constitutes acceptance of such amendments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">02.</span> DATA ACQUISITION VECTORS
            </h2>
            <p className="mb-4 opacity-80">
              We employ a minimalist yet necessary data collection strategy to ensure the functionality of our neural network interfaces. Data is collected through the following vectors:
            </p>
            <ul className="list-disc ml-4 space-y-2 opacity-70 text-sm">
                <li><strong>Voluntary Identification Data:</strong> Includes but is not limited to email addresses, usernames, and encrypted authentication tokens provided during the registration process via Supabase Auth.</li>
                <li><strong>Telemetry & Usage Metadata:</strong> Automated collection of IP addresses, browser User-Agent strings, timezone settings, and session duration metrics to optimize latency and server load balancing.</li>
                <li><strong>Conversational Inputs:</strong> Textual and audio data inputs provided by You during interactions with "FlowSensei" or "Lesson Mode" are processed to generate contextual responses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">03.</span> ARTIFICIAL INTELLIGENCE & THIRD-PARTY PROCESSORS
            </h2>
            <p className="opacity-80">
              The Service utilizes advanced Large Language Models (LLMs) provided by third-party infrastructure (including but not limited to <strong>Groq, OpenAI, and Meta's Llama architecture</strong>). By using the Service, You acknowledge and agree that:
            </p>
            <div className="mt-4 p-4 bg-black/30 border-l-2 border-emerald-500/50 text-xs text-gray-400 italic">
               (a) Your inputs are transmitted via secure API endpoints to these providers for inference purposes; 
               (b) We configure our API parameters to request non-retention of data for model training where possible, but cannot guarantee the internal protocols of third-party vendors; 
               (c) The AI responses are generated stochastically and may contain inaccuracies, hallucinations, or cultural errors for which The Company assumes no liability.
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">04.</span> FINANCIAL TRANSACTIONS & CRYPTOCURRENCY PROTOCOLS
            </h2>
            <p className="mb-4 opacity-80">
              We utilize distinct protocols for Fiat and Decentralized Ledger Technology (Crypto) payments:
            </p>
            <p className="mb-4 opacity-80">
              <strong>Fiat Payments:</strong> Processed via Payment Card Industry Data Security Standard (PCI-DSS) compliant processors (e.g., Stripe, Whop). We do not store, view, or have access to your full credit card information.
            </p>
            <p className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
              <strong>⚠️ CRYPTOCURRENCY DISCLAIMER:</strong> Payments made via cryptocurrency (Bitcoin, Ethereum, USDT, etc.) are processed on immutable blockchain ledgers. Due to the irreversible nature of these transactions, <strong>ALL CRYPTO PAYMENTS ARE FINAL AND NON-REFUNDABLE</strong> under any circumstances, including but not limited to user error, wallet address mistakes, or dissatisfaction with the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">05.</span> DATA RETENTION & DELETION ("THE NINJA VANISH")
            </h2>
            <p className="opacity-80">
              We retain personal data only for as long as necessary to provide the Service and for legitimate business purposes, such as maintaining the integrity of our algorithms and complying with legal obligations.
              <br/><br/>
              <strong>Right to Erasure:</strong> You may request the total deletion of your account and associated datasets. Upon such request to our support channels, we will execute a "Hard Delete" protocol, scrubbing your identifiers from our active databases. Note that residual data may persist in encrypted backups for a limited period solely for disaster recovery purposes before being overwritten.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">06.</span> LIMITATION OF LIABILITY
            </h2>
            <p className="opacity-80 text-xs uppercase tracking-wide">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, FLOWCRAFT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; OR (III) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
            </p>
          </section>

          <div className="pt-10 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs">
                END OF DOCUMENT<br/>
                FlowCraft Inc. © 2025
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
);
