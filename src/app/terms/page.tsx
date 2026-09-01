'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 mb-4 transition"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Scale size={20} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Terms and Conditions</h1>
          </div>
          <p className="text-xs text-gray-400 mt-2">Last updated: September 2026</p>
        </div>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using <strong>ArtVault</strong>, registering an account, purchasing artwork, or joining creative workshops, you agree to comply with and be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Platform Usage & Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Users must provide accurate account details during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>ArtVault reserves the right to suspend accounts that violate platform policies.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Intellectual Property & Copyright</h2>
            <p>
              All original artworks displayed on ArtVault remain the exclusive intellectual property of the respective artists.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Buyers:</strong> Purchasing an artwork grants personal display rights only. Commercial reproduction is strictly prohibited.</li>
              <li><strong>Artists:</strong> By uploading art, you confirm that you hold full original ownership.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Purchases & Refunds</h2>
            <p>
              All prices are listed in LKR. Returns or replacements are handled strictly if physical artwork arrives damaged, within 48 hours of delivery.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>Questions? Contact support@artvault.com</p>
          <Link href="/terms/privacy" className="text-purple-600 font-semibold hover:underline">
            View Privacy Policy
          </Link>
        </div>

      </div>
    </div>
  );
}