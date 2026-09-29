"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; 

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) return;
    setStatus("loading");

    // Insert into Supabase
    const { error } = await supabase
      .from("subscribers")
      .insert([{ email: email }]);

    if (error) {
      // 23505 is the PostgreSQL error code for a unique constraint violation
      if (error.code === '23505') {
        setStatus("error");
        setMessage("You are already subscribed! 🎉");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Try again.");
      }
    } else {
      setStatus("success");
      setMessage("Thanks for subscribing! 🚀");
      setEmail(""); // Clear the input
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ENTER YOUR EMAIL FOR UPDATES"
          className="border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          disabled={status === "loading" || status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`px-6 py-2 rounded-full font-bold text-white transition ${
            status === "success" 
              ? "bg-green-500" 
              : "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400"
          }`}
        >
          {status === "loading" ? "WAIT..." : status === "success" ? "DONE!" : "SUBSCRIBE"}
        </button>
      </form>
      
      {/* Feedback Message */}
      {message && (
        <p className={`text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}