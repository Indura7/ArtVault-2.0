
import { supabase } from '@/lib/supabase'; 
import ArtworkCard from "@/components/modules/artworks/artworkcard";
import Link from "next/link";


export default async function ArtworksPage() {
  // 1. Fetch data from Supabase database table
  const { data: artworks, error } = await supabase
.from("artwork")
    .select(`*,
      artist(first_name,last_name)`);
  if (error) {
    console.error("Error fetching artworks:", error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6"> Explore Artworks</h1>
      
      
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks?.map((item) => (
          <Link key={item.art_id} href={`/artworks/${item.art_id}`}>
          <ArtworkCard key={item.art_id} artwork={item} />
          </Link>
        ))}
      </div>

      


    </div>
  );
}