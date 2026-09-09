"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
  { label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export default function ResetPasswordPage() {
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [validSession, setValidSession] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password]
  );
  const allRulesPassed = ruleResults.every((r) => r.passed);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
      setCheckingSession(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!allRulesPassed) {
      setErrorMsg("Please meet all password requirements.");
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Password updated! Redirecting you to sign in...");
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8">
      {/* Split Card Modal Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col md:flex-row">
        
        {/* Left Side: Gallery Artwork Showcase Banner */}
        <div className="relative md:w-5/12 flex flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white min-h-[320px] md:min-h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-700 hover:scale-105"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=1000&auto=format&fit=crop')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/60 pointer-events-none" />

          {/* Centerpiece Artwork */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 p-2 bg-black/85 rounded-lg border-2 border-slate-700/80 shadow-2xl backdrop-blur-xs flex items-center justify-center">
              <div 
                className="w-full h-full rounded bg-cover bg-center border border-slate-600"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop')" }}
              />
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

          {/* Bottom Branding */}
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
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Set New Password</h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your new secure password below.
              </p>
            </div>

            {checkingSession ? (
              <p className="text-center text-xs text-slate-500 py-6">Verifying your reset link...</p>
            ) : !validSession ? (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
                This reset link is invalid or has expired. Please request a new one from the{" "}
                <Link href="/auth/forgot-password" className="underline font-bold">
                  forgot password
                </Link>{" "}
                page.
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg mb-5 flex items-center gap-2">
                    <span>⚠️ {errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg mb-5 flex items-center gap-2">
                    <span>✅ {successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      NEW PASSWORD
                    </label>
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

                    {password.length > 0 && (
                      <ul className="mt-2 grid grid-cols-2 gap-1 pt-1">
                        {ruleResults.map((rule) => (
                          <li
                            key={rule.label}
                            className={`flex items-center gap-1.5 text-[10px] ${
                              rule.passed ? "text-green-600 font-medium" : "text-slate-400"
                            }`}
                          >
                            {rule.passed ? <Check size={11} /> : <X size={11} />}
                            {rule.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      CONFIRM NEW PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full py-2 pr-8 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase mt-4"
                  >
                    {loading ? "UPDATING PASSWORD..." : "UPDATE PASSWORD"}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-500 mt-8 pt-4 border-t border-slate-100">
            <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}