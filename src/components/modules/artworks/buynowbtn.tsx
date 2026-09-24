"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Make sure this path matches your supabase setup

export default function BuyNowButton({ artwork }: { artwork: any }) {
  const [isArtist, setIsArtist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Use auth_id to check the customer table
        const { data: customerProfile } = await supabase
          .from("customer")
          .select("auth_id")
          .eq("auth_id", user.id)
          .maybeSingle();

        // If no customer profile is found, they are an artist
        if (!customerProfile) {
          setIsArtist(true);
        }
      }
      setLoading(false);
    }

    checkRole();
  }, []);

  if (loading) {
    return (
      <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-3 rounded-lg text-center block animate-pulse">
        Checking...
      </button>
    );
  }

  return (
    <>
      {isArtist ? (
        <button 
          disabled
          className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed uppercase text-center block"
        >
          Artists Cannot Purchase
        </button>
      ) : artwork.status === 'Sold' ? (
        <button 
          disabled
          className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed uppercase text-center block"
        >
          Sold Out
        </button>
      ) : (
        <Link 
          href={`/checkout/${artwork.art_id}`}
          className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white font-bold py-3 rounded-lg transition uppercase text-center block"
        >
          Buy Now
        </Link>
      )}
    </>
  );
}