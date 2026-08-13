
import { supabase } from '@/lib/supabase'; 
import ArtworkCard from "@/components/modules/artworks/artworkcard";
import Link from "next/link";


export default async function ArtworksPage() {
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
      
      
      

      <div className="columns-1  sm:columns-2 lg:columns-3 gap-6 ">  
        {/* 1 columns in mobiles ,2 colums in tablets and 3 colums in desktops */}

        {artworks?.map((item) => (

          <div key={item.art_id} className='break-inside-avoid'>
          <Link key={item.art_id} href={`/artworks/${item.art_id}`}>
          <ArtworkCard key={item.art_id} artwork={item} />
          </Link>
          </div>
        ))}
      </div>

      


    </div>
  );
}