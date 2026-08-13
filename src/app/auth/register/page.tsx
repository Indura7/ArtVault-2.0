"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X, Heart, Paintbrush, Upload } from "lucide-react";
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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Artist Additional Information States
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState("Digital Art");
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
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) return setErrorMsg("Please enter your full name.");
    if (!allRulesPassed) return setErrorMsg("Please meet all password requirements.");
    if (!passwordsMatch) return setErrorMsg("Passwords do not match.");
    if (!agreedToTerms) return setErrorMsg("Please agree to the Terms of Service.");

    setLoading(true);
    try {
      // 1. Register User in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
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
            .from("avatars") // Make sure this bucket exists in Supabase Storage
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
            id: data.user.id,
            full_name: fullName,
            email: email,
            display_name: displayName || fullName,
            category: category,
            bio: bio,
            avatar_url: avatarUrl,
          });

          if (dbError) console.error("Artist DB insertion failed:", dbError);
        } else {
          const { error: dbError } = await supabase.from("customer").insert({
            id: data.user.id,
            full_name: fullName,
            email: email,
          });

          if (dbError) console.error("Customer DB insertion failed:", dbError);
        }
      }

      setSuccessMsg("Account created! Please check your email to confirm your address.");
      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/assets/images/logo.png"
            alt="ArtVault Logo"
            width={64}
            height={64}
            className="object-contain mb-3"
          />
          <h1 className="text-2xl font-serif font-bold text-gray-900">Create Account</h1>
          <p className="text-xs text-gray-500 mt-1">Select your Role ?</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md mb-4">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-md mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg border-2 text-xs font-medium transition ${
                role === "customer"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <Heart size={16} className={role === "customer" ? "text-indigo-600" : "text-gray-400"} />
              Join as Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("artist")}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg border-2 text-xs font-medium transition ${
                role === "artist"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <Paintbrush size={16} className={role === "artist" ? "text-indigo-600" : "text-gray-400"} />
              Join as an Artist
            </button>
          </div>

          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider border-b pb-1">
            Basic Information
          </p>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Liyanage Nuwan Kaushalya"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nuwan@gmail.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-9 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {ruleResults.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-[11px] ${
                      rule.passed ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {rule.passed ? <Check size={12} /> : <X size={12} />}
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-9 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1 text-[11px] text-red-500">Passwords do not match</p>
            )}
          </div>

          {/* Artist Extra Fields */}
          {role === "artist" && (
            <>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider border-b pb-1 pt-2">
                Artist Information
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Artist Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="eg : Nuwan Art Studio"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Select Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="Digital Art">Digital Art</option>
                  <option value="Oil Painting">Oil Painting</option>
                  <option value="Illustration">Illustration</option>
                  <option value="3D Art">3D Art</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bio / About Artist</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your creative journey..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Profile Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : null}

                  <label className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition">
                    <Upload size={18} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600 font-medium">Upload Profile Image</span>
                    <span className="text-[10px] text-gray-400">JPG, PNG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Terms Agreement */}
          <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 accent-indigo-600"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-indigo-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-xs font-semibold tracking-wider rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Hyperlink to Login */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}