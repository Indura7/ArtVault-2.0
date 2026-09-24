"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LikeCountProps {
  artworkId: number;
}

export default function LikeCount({ artworkId }: LikeCountProps) {
  const [likeCount, setLikeCount] = useState(0);
 
  useEffect(() => {
    async function fetchLikeCount() {
      const { count } = await supabase
        .from("wish_list")
        .select("*", { count: "exact", head: true })
        .eq("artwork_id", artworkId);

      if (count !== null) setLikeCount(count);
    }

    if (artworkId) fetchLikeCount();
  }, [artworkId]);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600">
      <Heart size={18} className="text-gray-400" />
      <span>{likeCount}</span>
    </span>
  );
}