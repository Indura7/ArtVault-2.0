"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface FavoriteButtonProps {
  artworkId: number;
}

export default function FavoriteButton({ artworkId }: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if current user has already favorited this artwork
  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Find logged-in customer record safely
      let { data: customer } = await supabase
        .from("customer")
        .select("customer_id")
        .eq("auth_id", user.id)
        .maybeSingle();

      // Fallback by email if auth_id was not yet linked
      if (!customer && user.email) {
        const { data: byEmail } = await supabase
          .from("customer")
          .select("customer_id")
          .eq("email", user.email)
          .maybeSingle();
        if (byEmail) {
          customer = byEmail;
          await supabase.from("customer").update({ auth_id: user.id }).eq("customer_id", byEmail.customer_id);
        }
      }

      if (!customer) return;

      // Check if row exists in wish_list
      const { data } = await supabase
        .from("wish_list")
        .select("id")
        .eq("customer_id", customer.customer_id)
        .eq("artowrk_id", artworkId)
        .maybeSingle();

      if (data) setIsFavorited(true);
    }

    if (artworkId) checkStatus();
  }, [artworkId]);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || !artworkId) return;
    setLoading(true);

    // 1. Check user login status
    const { data: { user } } = await supabase.auth.getUser();

    // 2. If NOT logged in -> Redirect to Login Page
    if (!user) {
      router.push("/auth/login");
      setLoading(false);
      return;
    }

    // 3. If logged in -> Find Customer ID safely
    let { data: customer } = await supabase
      .from("customer")
      .select("customer_id")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (!customer && user.email) {
      const { data: byEmail } = await supabase
        .from("customer")
        .select("customer_id")
        .eq("email", user.email)
        .maybeSingle();
      if (byEmail) {
        customer = byEmail;
        await supabase.from("customer").update({ auth_id: user.id }).eq("customer_id", byEmail.customer_id);
      }
    }

    // If still no customer record, create one for this user
    if (!customer) {
      const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer";
      const parts = fullName.split(" ");
      const first_name = parts[0] || "Customer";
      const last_name = parts.slice(1).join(" ") || "";
      const { data: newCustomer, error: createError } = await supabase
        .from("customer")
        .insert({
          auth_id: user.id,
          email: user.email,
          first_name,
          last_name,
        })
        .select("customer_id")
        .maybeSingle();

      if (!createError && newCustomer) {
        customer = newCustomer;
      } else {
        console.error("Error linking customer record:", createError);
        setLoading(false);
        return;
      }
    }

    // 4. Toggle Wishlist status in Supabase
    if (isFavorited) {
      // Remove from wishlist
      const { error } = await supabase
        .from("wish_list")
        .delete()
        .eq("customer_id", customer.customer_id)
        .eq("artowrk_id", artworkId);

      if (!error) setIsFavorited(false);
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from("wish_list")
        .insert([{ customer_id: customer.customer_id, artowrk_id: artworkId }]);

      if (!error) setIsFavorited(true);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleHeartClick}
      disabled={loading}
      title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
      className="p-2 rounded-full hover:bg-gray-100 transition duration-150 cursor-pointer"
    >
      <Heart
        size={18}
        className={
          isFavorited
            ? "text-red-500 fill-red-500" // Red filled when favorited
            : "text-gray-400 hover:text-red-500" // Dim outline when not favorited
        }
      />
    </button>
  );
}