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

  // Helper function to resolve customer ID safely
  const getCustomer = async (user: any) => {
    let { data: customers } = await supabase
      .from("customer")
      .select("customer_id")
      .eq("auth_id", user.id)
      .limit(1);

    let customer = customers && customers.length > 0 ? customers[0] : null;

    if (!customer && user.email) {
      const { data: byEmail } = await supabase
        .from("customer")
        .select("customer_id")
        .eq("email", user.email)
        .limit(1);

      if (byEmail && byEmail.length > 0) {
        customer = byEmail[0];
        await supabase
          .from("customer")
          .update({ auth_id: user.id })
          .eq("customer_id", customer.customer_id);
      }
    }

    return customer;
  };

  // Check initial wishlist status
  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const customer = await getCustomer(user);
      if (!customer) return;

      const { data, error } = await supabase
        .from("wish_list")
        .select("id")
        .eq("customer_id", customer.customer_id)
        .eq("artwork_id", artworkId)
        .limit(1);

      if (!error && data && data.length > 0) {
        setIsFavorited(true);
      }
    }

    if (artworkId) checkStatus();
  }, [artworkId]);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || !artworkId) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    // Redirect unauthenticated users to register page
    if (!user) {
      router.push("/auth/register");
      setLoading(false);
      return;
    }

    const customer = await getCustomer(user);
    if (!customer) {
      setLoading(false);
      return;
    }

    if (isFavorited) {
      // Remove from wishlist
      const { error } = await supabase
        .from("wish_list")
        .delete()
        .eq("customer_id", customer.customer_id)
        .eq("artwork_id", artworkId);

      if (!error) setIsFavorited(false);
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from("wish_list")
        .insert([{ customer_id: customer.customer_id, artwork_id: artworkId }]);

      if (!error) setIsFavorited(true);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleHeartClick}
      disabled={loading}
      className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-sm border ${
        isFavorited
          ? "bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
          : "bg-white border-gray-200 text-purple-600 hover:border-purple-300 hover:bg-purple-50/50"
      }`}
    >
      <Heart
        size={18}
        className={
          isFavorited
            ? "text-purple-600 fill-purple-600"
            : "text-purple-600 stroke-[2.5]"
        }
      />
      <span>{isFavorited ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}</span>
    </button>
  );
}