"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8">
      {/* Split Card Modal Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col md:flex-row">
        
        {/* Left Side: Gallery Artwork Showcase Banner */}
        <div className="relative md:w-5/12 flex flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white min-h-[340px] md:min-h-[540px] overflow-hidden">
          {/* Gallery Background Wall with Spotlight */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-700 hover:scale-105"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=1000&auto=format&fit=crop')"
            }}
          />
          {/* Gradient Overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/60 pointer-events-none" />

          {/* Framed Centerpiece Pink Artwork */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 p-2 bg-black/85 rounded-lg border-2 border-slate-700/80 shadow-2xl backdrop-blur-xs flex items-center justify-center">
              <div 
                className="w-full h-full rounded bg-cover bg-center border border-slate-600"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop')" }}
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-10 bg-white/15 blur-xl rounded-full pointer-events-none" />
            </div>
          </div>

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <Image 
              src="/assets/images/logo.png" 
              alt="ArtVault" 
              width={34} 
              height={34} 
              className="object-contain" 
            />
            <span className="font-extrabold uppercase tracking-widest text-xs sm:text-sm text-white">
              ArtVault
            </span>
          </div>

          {/* Bottom Branding & Taglines */}
          <div className="relative z-10 space-y-2 mt-auto">
            <span className="text-[10px] font-bold tracking-[0.25em] text-slate-300 uppercase block">
              CURATION FIRST
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Where Vision <br />
              <span className="text-white">
                Meets Value.
              </span>
            </h2>
            <p className="text-xs text-slate-300/90 leading-relaxed max-w-xs pt-1">
              Join a global community of world-class creators and sophisticated collectors.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form Content */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access your ArtVault account.
              </p>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg mb-5 flex items-center gap-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-2 pr-8 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase mt-4"
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </form>
          </div>

          {/* Hyperlink to Register */}
          <p className="text-center text-xs text-slate-500 mt-8 pt-4 border-t border-slate-100">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}