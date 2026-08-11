import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data: artwork, error } = await supabase
    .from("artwork")
    .select(`*,
      artist (
        first_name,
        last_name)
    `)
    .eq("art_id", id)
    .single();

  
  if (error || !artwork) {
    notFound();
  }

  return (
    <div className="container mx-auto p-5 max-w-5xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div >
          <img
            src={artwork.image_path}
            alt={artwork.title}
            className="w-full h-auto block rounded-t-lg"
          />
        </div>


        <div className="flex flex-col justify-start gap-6">
          <div>
            <br />
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            <p className="text-gray-600 mt-1">
              By {artwork.artist 
                ? `${artwork.artist.first_name} ${artwork.artist.last_name}`
                : "Unknown Artist"}
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">
              {artwork.type }
            </span>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg  space-y-3">
            <h2 className="text-3xl font-extrabold text-blue-600">
              {Number(artwork.price).toLocaleString("en-US", { minimumFractionDigits: 2 })} LKR
            </h2>
            <button className="w-full py-3 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700 transition">
              BUY NOW
            </button>
          </div>

        </div>
      </div>


      <div className="border-t pt-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
        <p className="text-gray-700">
          {artwork.description || "No description available for this artwork."}
        </p>
      </div>
    </div>
  );
}