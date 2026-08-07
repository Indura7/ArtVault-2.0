
import { supabase } from '@/lib/supabase'; 
import ArtworkCard from "@/components/modules/artworks/artworkcard";


export default async function ArtworksPage() {
  // 1. Fetch data from Supabase database table
  const { data: artworks, error } = await supabase
    .from("artwork")
    .select("*");

  if (error) {
    console.error("Error fetching artworks:", error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6"> Explore Artworks</h1>
      
      {/* 2. Map over database rows and pass them to your component */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks?.map((item) => (
          <ArtworkCard key={item.art_id} artwork={item} />
        ))}
      </div>
    </div>
  );
}