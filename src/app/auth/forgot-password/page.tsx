"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Added missing import
import { Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Always show the same success state whether or not the email exists,
    // so we don't leak which addresses have accounts.
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/assets/images/logo.png"
            alt="ArtVault Logo"
            width={64}
            height={64}
            className="object-contain mb-3"
          />
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            ArtVault
          </h1>
          <p className="text-[10px] font-semibold tracking-widest text-indigo-500 uppercase mt-1">
            Digital Creators Portal
          </p>
        </div> {/* Closed missing div here */}

        {/* Title Section */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Reset Password
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md mb-4">
            {errorMsg}
          </div>
        )}

        {sent ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md text-center">
            If an account exists for <strong>{email}</strong>, a password reset link has been sent.
            Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold tracking-wider rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </form>
        )}

        <Link
          href="/auth?mode=login"
          className="flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 mt-6"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}