"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Heart, PenLine, Upload, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Role = "customer" | "artist";

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

export default function RegisterPage() {
  const router = useRouter();

  // Basic Form States
  const [role, setRole] = useState<Role>("customer");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile_no, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Artist Additional Information States
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password]
  );
  const allRulesPassed = ruleResults.every((r) => r.passed);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Handle Profile Image Selection
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("File size must be under 5MB.");
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!first_name.trim() || !last_name.trim()) return setErrorMsg("Please enter your full name.");
    if (!allRulesPassed) return setErrorMsg("Please meet all password requirements.");
    if (!passwordsMatch) return setErrorMsg("Passwords do not match.");
    if (!agreedToTerms) return setErrorMsg("Please agree to the Terms of Service.");

    setLoading(true);
    try {
      // 1. Register User in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: `${first_name} ${last_name}`, role } },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        let avatarUrl = "";

        // 2. Upload Profile Picture if user is an artist and selected a picture
        if (role === "artist" && profileImage) {
          const fileExt = profileImage.name.split(".").pop();
          const filePath = `${data.user.id}-${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, profileImage);

          if (uploadError) {
            console.error("Image upload failed:", uploadError.message);
          } else {
            const { data: publicUrlData } = supabase.storage
              .from("avatars")
              .getPublicUrl(filePath);
            avatarUrl = publicUrlData.publicUrl;
          }
        }

        // 3. Save details into database tables
        if (role === "artist") {
          const { error: dbError } = await supabase.from("artist").insert({
            auth_id: data.user.id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            mobile_no: mobile_no,
            address: address,
            category: category,
            bio: bio,
            avatar_url: avatarUrl,
          });

          if (dbError) console.error("Artist DB insertion failed:", dbError);
        } else {
          const { error: dbError } = await supabase.from("customer").insert({
            auth_id: data.user.id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            mobile_no: mobile_no,
          });

          if (dbError) console.error("Customer DB insertion failed:", dbError);
        }
      }

      setSuccessMsg("Account created! Please check your email to confirm your address.");
      setLoading(false);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8">
      {/* Split Card Modal Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col md:flex-row">
        
        {/* Left Side: Gallery Artwork Showcase Banner */}
        <div className="relative md:w-5/12 flex flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white min-h-[380px] md:min-h-[620px] overflow-hidden">
          {/* Gallery Background Wall with Spotlight */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-700 hover:scale-105"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=1000&auto=format&fit=crop')"
            }}
          />
          {/* Gradient Overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/60 pointer-events-none" />

          {/* Framed Centerpiece Pink Artwork (like in reference mockup) */}
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

        {/* Right Side: Form Content */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h1>
              <p className="text-xs text-slate-500 mt-1">Select your Role ?</p>
            </div>

            {/* Error / Success Notifications */}
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

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition-all ${
                    role === "customer"
                      ? "border-2 border-blue-500 bg-blue-50/30 text-blue-600 shadow-xs"
                      : "border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Heart size={16} className={role === "customer" ? "text-blue-600 fill-blue-100" : "text-slate-400"} />
                  <span>Join as Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("artist")}
                  className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition-all ${
                    role === "artist"
                      ? "border-2 border-blue-500 bg-blue-50/30 text-blue-600 shadow-xs"
                      : "border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <PenLine size={16} className={role === "artist" ? "text-blue-600" : "text-slate-400"} />
                  <span>Join as an Artist</span>
                </button>
              </div>

              {/* Section Tag for Artist Mode */}
              {role === "artist" && (
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  BASIC INFORMATION
                </p>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  FIRST NAME
                </label>
                <input
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nuwan"
                  className="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  LAST NAME
                </label>
                <input
                  type="text"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kaushalya"
                  className="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nuwan@gmail.com"
                  className="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300"
                  required
                />
              </div>

               <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile_no}
                  onChange={(e) => setMobileNo(e.target.value)}
                  placeholder="0712345678"
                  className="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  PASSWORD
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

                {/* Password Rules Checklist */}
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  CONFIRM PASSWORD
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

              {/* Artist Extra Fields */}
              {role === "artist" && (
                <div className="pt-2 space-y-4">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest border-t border-slate-100 pt-4">
                    ARTIST INFORMATION
                  </p>

                  {/* Artist Display Name */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      ADDRESS
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="eg : 123 Art Street, Creative City"
                      className="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300"
                    />
                  </div>

                  {/* Select Category */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      SELECT CATEGORY
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 bg-transparent"
                    >
                      <option value="Digital Art">Digital Art</option>
                      <option value="Oil Painting">Oil Painting</option>
                      <option value="Illustration">Illustration</option>
                      <option value="3D Art">3D Art</option>
                      <option value="Photography">Photography</option>
                      <option value="Surrealism">Surrealism</option>
                      <option value="Minimalism">Minimalism</option>
                      <option value="Expressionism">Expressionism</option>
                    </select>
                  </div>

                  {/* Bio / About Artist */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      BIO / ABOUT ARTIST
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about your creative journey..."
                      className="w-full py-2 border-b border-slate-200 focus:border-blue-600 outline-none text-xs sm:text-sm text-slate-800 transition bg-transparent placeholder:text-slate-300 resize-none"
                    />
                  </div>

                  {/* Profile Image Upload */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      PROFILE IMAGE
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      {imagePreview && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
                          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        </div>
                      )}

                      <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition">
                        <Upload size={15} className="text-slate-400" />
                        <div className="text-left">
                          <span className="text-[11px] text-slate-700 font-semibold block leading-tight">
                            Upload Profile Image
                          </span>
                          <span className="text-[9px] text-slate-400">JPG, PNG up to 5MB</span>
                        </div>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms Agreement */}
              <label className="flex items-start gap-2 text-[11px] text-slate-500 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 accent-blue-600 rounded"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 font-semibold hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase mt-2"
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>
            </form>
          </div>

          {/* Hyperlink to Login */}
          <p className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}