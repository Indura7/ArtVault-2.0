'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        
        <div>
          <Link 
            href="/terms" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 mb-4 transition"
          >
            <ArrowLeft size={14} /> Back to Terms
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Privacy Policy</h1>
          </div>
          <p className="text-xs text-gray-400 mt-2">Last updated: September 2026</p>
        </div>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal Data:</strong> Name, email address, contact numbers, and delivery addresses.</li>
              <li><strong>Artist Data:</strong> Portfolios, bio details, and earnings transaction records.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. How Data is Used</h2>
            <p>
              We use your data solely to fulfill artwork orders, facilitate workshop enrollments, process payments securely, and send order status notifications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Data Security</h2>
            <p>
              Your personal information is stored securely and is never sold to third-party advertisers.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>Privacy concerns? Contact privacy@artvault.com</p>
          <Link href="/terms" className="text-purple-600 font-semibold hover:underline">
            View Terms & Conditions
          </Link>
        </div>

      </div>
    </div>
  );
}