
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { notFound } from "next/navigation";
import Zoom from "@/components/modules/artworks/zoom";
import Link from "next/link";
import {Truck} from 'lucide-react';
import {MessagesSquare } from 'lucide-react';
import ArtworkCard from "@/components/modules/artworks/artworkcard";
import Artworkcomment from "@/components/modules/artworks/artworkcomment";
import BuyNowButton from "@/components/modules/artworks/buynowbtn";

interface PageProps {
  params: Promise<{ id: string }>;
}
const { data: { user } } = await supabase.auth.getUser();
let isArtist = false;

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data: artwork, error } = await supabase
    .from("artwork")
    .select(`*,
      medium(medium_name),
      artist (
        first_name,
        last_name)
    `)
    .eq("art_id", id)
    .single();

  
  if (error || !artwork) {
    notFound();
  }

  /* if (user) {
    const { data: customerProfile } = await supabase
      .from("customer")
      .select("auth_id") // Make sure this matches your actual column name
      .eq("auth_id", user.id)
      .maybeSingle();

    // 3. Inverse Logic: If they are NOT a customer, they must be an artist!
    if (!customerProfile) {
      isArtist = true;
    }
  }
 */
  const { data: relatedArtworks } = await supabase
    .from("artwork")
    .select(`*,
      medium(medium_name),
      artist (
        first_name,
        last_name)
    `)
    .eq("artist_id", artwork.artist_id)
    .neq("art_id", artwork.art_id) // Exclude the current artwork
    .limit(6);

    const { data: categoryArtworks } = await supabase
    .from("artwork")
    .select(`*,
      medium(medium_name),
      artist (
        first_name,
        last_name)
    `)
    .eq("medium_id", artwork.medium_id) // Make sure 'medium_id' matches your DB column name!
    .neq("art_id", artwork.art_id)
    .limit(6);

  return (
    
    <div className="container mx-auto pb-10 max-w-5xl space-y-5">
      <p>Artwork Detail Page </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="flex justify-center items-center hover:scale-115 transition-transform duration-300">
          <Zoom
          src={artwork.image_path}
          alt={artwork.title}
       /*    width={800}
          height={1200} */
        />
           {/* <Image
            src={artwork.image_path} 
            alt={artwork.title}
            width={800}
            height={1200}
            className="w-full h-auto block rounded-t-lg"
          />  */}
        </div>


        <div className="flex flex-col justify-start gap-8">
          <div className="px-2">
            <br />
            <h1 className="text-3xl font-bold py-1">{artwork.title}</h1>

              <Link href={`/artists/${artwork.artist_id}`} className="text-blue-500 ">
                <p className="text-gray-600 mt-1 ">
                  <span>By  </span> 
                   <span className="hover-scale-text ">
                     {artwork.artist
                      ? `${artwork.artist.first_name} ${artwork.artist.last_name}`
                      : "Unknown Artist"}
                   </span>
                </p>
              </Link>
           

            <p className="text-gray-600 mt-1">
              added on : {artwork.date_added.split("-")[1]} - {artwork.date_added.split("-")[0]} 
            </p>
            <p className="text-gray-600 mt-1">
              Dimensions : {artwork.width} x {artwork.height} cm
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">
              {artwork.medium? `${artwork.medium.medium_name}` : "Unknown Medium"}
            </span>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg  space-y-3">
            <h2 className="text-3xl font-extrabold text-blue-600">
              {Number(artwork.price).toLocaleString("en-US", { minimumFractionDigits: 2 })} LKR
            </h2>
            {/* {isArtist ? (
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed uppercase text-center block"
              >
                Artists Cannot Purchase
              </button>
              ):artwork.status === 'Sold' ? (
                <button 
                  disabled
                  className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed uppercase"
                >
                  Sold Out
                </button>
              ) : (
                <Link href={`/checkout/${artwork.art_id}`}>
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition uppercase hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  Buy Now
                </button>
                </Link>
              )} */}

              <BuyNowButton artwork={artwork} />
            <p className="flex items-center gap-2 mt-2"><MessagesSquare size={16} className="shrink-0" />Message Artist regarding inquiries.</p>
            
            <p className="flex items-center gap-2 mt-0"><Truck size={16}/>Ships directly from the artist</p>
          </div>

        </div>
      </div>


      <div className="pt-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
        <p className="text-gray-700">
          {artwork.description || "No description available for this artwork."}
        </p>
        <Artworkcomment artworkId={artwork.art_id} />
      </div>


      

      
      {relatedArtworks && relatedArtworks.length > 0 && (
        <div className="border-t pt-10 mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            More Works by {artwork.artist?.first_name || "this Artist"}
          </h3>
          
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
            {relatedArtworks.map((art) => (
              <div key={art.art_id} className="flex-none w-[280px] snap-start">

                <Link href={`/artworks/${art.art_id}`}>
                <ArtworkCard artwork={art} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {categoryArtworks && categoryArtworks.length > 0 && (
        <div className="border-t pt-10 mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            More in {artwork.medium?.medium_name || "this Category"}
          </h3>
          
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
            {categoryArtworks.map((art) => (
              <div key={art.art_id} className="flex-none w-[280px] snap-start">
                
                <Link href={`/artworks/${art.art_id}`}>
                  <ArtworkCard artwork={art} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}