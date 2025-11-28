// src/RefundPolicy.jsx
import React from 'react';
import { LogOut } from 'lucide-react'; 

export const RefundPolicy = () => (
  <div className="min-h-screen bg-anime-bg text-white p-10 font-sans max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold text-anime-primary mb-6">Refund Policy</h1>
    <p className="text-sm text-gray-500 mb-8">Last Updated: November 28, 2025</p>

    <h2 className="text-2xl font-bold mb-3">1. General Policy</h2>
    <p className="text-gray-300">
      We offer a full refund within **14 days** of the original purchase, provided that the service has not been substantially used.
    </p>

    <h2 className="text-2xl font-bold mt-6 mb-3">2. Conditions for Refund</h2>
    <ul className="list-disc ml-8 text-gray-300 space-y-2">
      <li>The request must be made within 14 calendar days of the transaction date.</li>
      <li>For AI services (chat/lessons), "Substantial Use" is defined as exceeding **20 messages** sent to the AI tutor. Refunds will not be processed after this threshold is met, regardless of the timeframe.</li>
      <li>We do not offer partial refunds for mid-month cancellations.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-6 mb-3">3. How to Request a Refund</h2>
    <p className="text-gray-300">
      Please contact our support team at support@flowcraftlang.com with your Order ID and the reason for your refund request.
    </p>
    
    <div className="mt-12 p-4 bg-anime-card/50 border border-white/10 rounded-lg">
      <p className="text-anime-warning font-semibold flex items-center gap-2">
        <LogOut size={18}/> Note: Refunds are processed by our merchant of record, Paddle.
      </p>
    </div>
  </div>
);