// src/PrivacyPolicy.jsx
import React from 'react';

export const PrivacyPolicy = ({ setView }) => (
  <div className="min-h-screen bg-anime-bg text-white p-10 font-sans max-w-4xl mx-auto">
    <button 
      onClick={() => setView('home')} 
      className="text-anime-accent hover:text-white transition mb-8 flex items-center gap-2"
    >
      ← Back to App
    </button>
    <h1 className="text-4xl font-bold text-anime-primary mb-6">Privacy Policy</h1>
    <p className="text-sm text-gray-500 mb-8">Last Updated: November 28, 2025</p>

    <h2 className="text-2xl font-bold mb-3">1. Data We Collect</h2>
    <p className="text-gray-300">
      We only collect the minimum data necessary for authentication and service delivery:
    </p>
    <ul className="list-disc ml-8 text-gray-300 space-y-2">
      <li><strong>Authentication Data:</strong> Your email address and a secure User ID (via Google Sign-In and Supabase).</li>
      <li><strong>Usage Data:</strong> Timestamps and message content (stored temporarily for conversation context and analysis).</li>
    </ul>

    <h2 className="text-2xl font-bold mt-6 mb-3">2. Third-Party Data Sharing</h2>
    <ul className="list-disc ml-8 text-gray-300 space-y-2">
      <li><strong>AI Processing:</strong> Your messages are sent to the Groq API solely to generate the educational response. They are not used to train our models.</li>
      <li><strong>Data Storage:</strong> All user and conversation data is securely hosted on Supabase servers.</li>
      <li><strong>Payment:</strong> All payment details (credit cards) are handled by Paddle and are never stored on our servers.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-6 mb-3">3. Data Retention</h2>
    <p className="text-gray-300">
      We retain conversation history to maintain context for your tutor. You may request deletion of your account and associated data by emailing us.
    </p>
  </div>
);