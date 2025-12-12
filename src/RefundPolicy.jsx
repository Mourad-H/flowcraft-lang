import React from 'react';
import { ChevronLeft, ShieldAlert, CheckCircle, AlertTriangle, Coins, Ban, FileText } from 'lucide-react';

export const RefundPolicy = ({ setView }) => (
  <div className="min-h-screen bg-[#050505] anime-grid-bg text-white p-4 md:p-6 font-sans relative overflow-x-hidden">
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-anime-accent/10 to-transparent pointer-events-none"></div>

    <div className="max-w-5xl mx-auto relative z-10">
      <button 
        onClick={() => setView('home')} 
        className="group flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 font-bold text-sm tracking-widest uppercase"
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition" size={16}/> Return to Base
      </button>

      <div className="bg-[#1e293b]/90 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-12 shadow-[0_0_100px_rgba(236,72,153,0.1)]">
        
        {/* Header Section */}
        <div className="border-b border-white/10 pb-8 mb-8">
            <h1 className="text-4xl md:text-6xl font-black font-manga mb-4 text-transparent bg-clip-text bg-gradient-to-r from-anime-accent to-purple-500 tracking-tighter">
              REFUND PROTOCOLS
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><ShieldAlert size={12}/> Status: Enforced</span>
                <span className="flex items-center gap-1"><FileText size={12}/> Doc: FLOW-RFD-2025-V4</span>
                <span>Effective: December 1, 2025</span>
            </div>
        </div>

        {/* Visual Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-pink-500/30 transition duration-300">
                <AlertTriangle className="text-pink-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">Digital Goods</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">Services are consumed immediately upon activation.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-pink-500/30 transition duration-300">
                <Coins className="text-pink-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">Crypto Finality</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">Blockchain transactions are immutable and non-refundable.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-pink-500/30 transition duration-300">
                <Ban className="text-pink-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">Anti-Abuse</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">Strict limits apply to prevent API resource exploitation.</p>
            </div>
        </div>

        {/* 🛑 THE WALL OF TEXT (Legal Jargon Injection) */}
        <div className="space-y-10 text-slate-300 text-sm md:text-base leading-loose font-light text-justify">
          
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-pink-500">01.</span> NATURE OF DIGITAL COMMODITIES
            </h2>
            <p className="opacity-80">
              <strong>FlowCraft</strong> provides intangible, irrevocable digital goods ("Software as a Service"). Unlike physical goods, the computing resources required to power our AI models (Large Language Model Inference) are consumed instantly upon your interaction with the platform. Therefore, the Company adheres to a strict Refund Policy that differs significantly from traditional e-commerce standards. By purchasing a subscription, you acknowledge that performance of the contract begins immediately, and you hereby waive your right of withdrawal once the service has been accessed or utilized.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-pink-500">02.</span> THE 14-DAY CONDITIONAL GUARANTEE
            </h2>
            <p className="mb-4 opacity-80">
              While we stand by the quality of our "Ninja Curriculum," we recognize that compatibility issues may arise. The Company grants a limited, revocable right to request a refund within <strong>14 calendar days</strong> of the initial transaction, STRICTLY subject to the "Fair Use & Consumption" conditions outlined below.
            </p>
            
            <div className="bg-black/30 p-6 rounded-xl border-l-2 border-pink-500/50">
              <h4 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">Fair Use & Consumption Thresholds</h4>
              <ul className="space-y-3 text-xs md:text-sm text-gray-400">
                <li className="flex gap-3">
                  <CheckCircle className="text-pink-500 shrink-0" size={16}/>
                  <span><strong>Temporal Limit:</strong> The request must be formally submitted via email within 336 hours (14 days) of the transaction timestamp.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-pink-500 shrink-0" size={16}/>
                  <span><strong>Resource Consumption Limit:</strong> The user must NOT have exceeded <strong>50 AI interactions</strong> (messages sent/received) or completed more than <strong>2 Lessons</strong>. Exceeding this threshold constitutes "Substantial Consumption" of our paid API resources, rendering the purchase non-refundable.</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-pink-500">03.</span> CRYPTOCURRENCY & BLOCKCHAIN TRANSACTIONS
            </h2>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-xs md:text-sm leading-relaxed">
              <strong>⚠️ IRREVOCABLE TRANSACTIONS:</strong> Please be advised that payments made via Decentralized Ledger Technology (including but not limited to Bitcoin, Ethereum, Solana, USDT) are technically irreversible. Due to the anonymity of wallet addresses and the volatility of digital asset markets, <strong>FlowCraft DOES NOT OFFER REFUNDS FOR CRYPTO PAYMENTS</strong> under any circumstances. All crypto sales are final upon network confirmation.
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-pink-500">04.</span> DISPUTE RESOLUTION & CHARGEBACKS
            </h2>
            <p className="opacity-80">
              The User agrees to contact FlowCraft Support (support@flowcraftco.com) to resolve any billing disputes prior to initiating a chargeback with their financial institution.
              <br/><br/>
              <strong>Fraudulent Chargebacks:</strong> In the event of a chargeback being filed without prior communication or justification, the Company reserves the right to: (a) Immediately suspend the User's account; (b) Blacklist the User's IP address and device fingerprint; and (c) Report the incident to relevant credit bureaus and fraud prevention databases as "Friendly Fraud."
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-pink-500">05.</span> SUBSCRIPTION TERMINATION
            </h2>
            <p className="opacity-80">
              You may terminate your recurring subscription at any time via the User Dashboard. Termination stops future billing cycles but does not generate a refund for the remaining duration of the current billing period. Access to Premium features will persist until the prepaid period expires.
            </p>
          </section>

          <div className="pt-10 border-t border-white/10 text-center">
             <a href="mailto:support@flowcraftco.com" className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-full text-pink-400 transition text-xs font-bold tracking-widest uppercase hover:scale-105 duration-300">
              Initiate Ticket via Support
            </a>
            <p className="text-gray-600 text-[10px] mt-4">
                FlowCraftCo. All Rights Reserved. © 2025
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
);
