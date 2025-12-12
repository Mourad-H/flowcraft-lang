import React from 'react';
import { ChevronLeft, Scale, Gavel, AlertOctagon, FileWarning, Terminal } from 'lucide-react';

export const Terms = ({ setView }) => (
  <div className="min-h-screen bg-[#050505] anime-grid-bg text-white p-4 md:p-6 font-sans relative overflow-x-hidden">
    {/* Background Atmosphere */}
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-600/10 to-transparent pointer-events-none"></div>

    <div className="max-w-5xl mx-auto relative z-10">
      <button 
        onClick={() => setView('home')} 
        className="group flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 font-bold text-sm tracking-widest uppercase"
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition" size={16}/> Return to Base
      </button>

      <div className="bg-[#1e293b]/90 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-12 shadow-[0_0_100px_rgba(147,51,234,0.1)]">
        
        {/* Header Section */}
        <div className="border-b border-white/10 pb-8 mb-8">
            <h1 className="text-4xl md:text-6xl font-black font-manga mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-tighter">
              TERMS OF SERVICE
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Scale size={12}/> Jurisdiction: International</span>
                <span className="flex items-center gap-1"><Gavel size={12}/> Status: Binding</span>
                <span>Last Revised: December 12, 2025</span>
            </div>
        </div>

        {/* Visual Warning Blocks */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-purple-500/30 transition duration-300">
                <Terminal className="text-purple-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">SaaS License</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">Access is granted via a limited, revocable, non-exclusive license.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-purple-500/30 transition duration-300">
                <AlertOctagon className="text-purple-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">AI Disclaimer</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">The AI may hallucinate facts. You assume full risk for usage.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-purple-500/30 transition duration-300">
                <FileWarning className="text-purple-500 mb-3" size={28}/>
                <h3 className="font-bold text-white mb-1">No Liability</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">The Company assumes zero liability for data loss or errors.</p>
            </div>
        </div>

        {/* 🛑 THE WALL OF TEXT (Legal Jargon Injection) */}
        <div className="space-y-10 text-slate-300 text-sm md:text-base leading-loose font-light text-justify">
          
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">01.</span> PREAMBLE AND BINDING AGREEMENT
            </h2>
            <p className="opacity-80">
              THIS TERMS OF SERVICE AGREEMENT ("Agreement") is a legally binding contract between YOU ("User," "Subscriber") and <strong>FlowCraftCo</strong> ("The Company," "We," "Provider"). By clicking "Sign Up," "Start Journey," accessing the API, or utilizing any portion of the Service, you unequivocally accept and agree to be bound by these Terms. If you do not agree to these Terms, you are strictly prohibited from accessing the Service. This Agreement applies to all visitors, users, and others who access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">02.</span> NATURE OF AI SERVICES & HALLUCINATIONS
            </h2>
            <p className="mb-4 opacity-80">
              The Service utilizes stochastic Large Language Models (LLMs) to generate responses. You acknowledge and agree that:
            </p>
            <div className="bg-purple-900/10 p-5 rounded-lg border border-purple-500/20 text-xs text-gray-300 italic">
                <ul className="list-disc ml-4 space-y-2">
                    <li><strong>No Warranty of Accuracy:</strong> The AI "FlowSensei" may confidently generate incorrect, misleading, or nonsensical information ("Hallucinations"). The Company makes no representations regarding the pedagogical accuracy of the language lessons.</li>
                    <li><strong>User Responsibility:</strong> You are solely responsible for verifying any information obtained from the Service. Reliance on any information provided by the AI is solely at your own risk.</li>
                    <li><strong>Not Professional Advice:</strong> The Service is for entertainment and educational simulation only. It does not constitute certified linguistic translation or professional advice.</li>
                </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">03.</span> PAYMENT, CRYPTO, AND SUBSCRIPTIONS
            </h2>
            <p className="opacity-80">
              <strong>Billing Authorization:</strong> By selecting a paid tier, you authorize our Merchants of Record (NowPayments/Whop) to charge your payment method.
              <br/><br/>
              <strong>Cryptocurrency Finality:</strong> You acknowledge that blockchain transactions (Bitcoin, Ethereum, USDT, etc.) are immutable. <strong>THE COMPANY CANNOT REVERSE, REFUND, OR RECOVER CRYPTO FUNDS SENT TO OUR WALLETS UNDER ANY CIRCUMSTANCES.</strong> Ensure network compatibility (e.g., ERC20 vs TRC20) before sending.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">04.</span> PROHIBITED CONDUCT (ZERO TOLERANCE)
            </h2>
            <p className="opacity-80">
              You agree not to engage in any of the following activities:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 opacity-70 text-sm">
                <li>Reverse engineering, decompiling, or attempting to derive the source code or API keys.</li>
                <li>Using the Service to generate hate speech, harassment, or illegal content.</li>
                <li>Deploying automated systems (bots, spiders, scrapers) to access the Service.</li>
                <li>Sharing your account credentials with third parties to bypass subscription limits.</li>
            </ul>
            <p className="mt-2 text-xs text-red-400">Violation of this section will result in immediate termination without refund and permanent blacklisting of your IP address.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">05.</span> INTELLECTUAL PROPERTY RIGHTS
            </h2>
            <p className="opacity-80">
              The Service and its original content (excluding User Content provided by you), features, and functionality are and will remain the exclusive property of FlowCraftCo and its licensors. The Service is protected by copyright, trademark, and unfair competition laws of International Commerce jurisdictions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">06.</span> LIMITATION OF LIABILITY (IMPORTANT)
            </h2>
            <div className="text-xs md:text-sm uppercase tracking-wide opacity-90 font-bold text-slate-400 border-l-4 border-purple-500 pl-4 py-2">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FLOWCRAFTCO, ITS AFFILIATES, AGENTS, DIRECTORS, OR EMPLOYEES BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THIS SERVICE. UNDER NO CIRCUMSTANCES WILL FLOWCRAFTCO BE RESPONSIBLE FOR ANY DAMAGE, LOSS OR INJURY RESULTING FROM HACKING, TAMPERING OR OTHER UNAUTHORIZED ACCESS OR USE OF THE SERVICE OR YOUR ACCOUNT OR THE INFORMATION CONTAINED THEREIN.
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">07.</span> INDEMNIFICATION
            </h2>
            <p className="opacity-80">
              You agree to defend, indemnify and hold harmless FlowCraftCo and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, or b) a breach of these Terms.
            </p>
          </section>

          <div className="pt-10 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs">
                FlowCraftCo. Sole Proprietorship. <br/>
                All Rights Reserved. © 2025
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
);
