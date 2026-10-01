import Image from "next/image";
import { User,Heart } from "lucide-react";
import{useState , useEffect} from "react";
import { supabase } from "@/lib/supabase";


interface ArtworkProps {
  artwork: {
    art_id: number;
    title: string;
    medium?: { medium_name: string };
    image_path: string;
    price: number;
    artist?: { first_name: string; last_name: string };
  };
}

export default function ArtworkCard({ artwork }: ArtworkProps) {
  
  const [likeCount,setLikeCount]=useState(0);
  useEffect(()=>{
    const fetchLikeCount=async()=>{
      const {count,error}=await supabase
      .from('wish_list')
      .select('*',{count:'exact', head:true})
      .eq('artwork_id',artwork.art_id);

      if(!error && count !== null){
        setLikeCount(count);}};
        
        fetchLikeCount();
  },[artwork.art_id]);
  
  return (
    


    <div className="card bg-white rounded-lg border border-gray-400 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Artwork Image */}
      <div /* className="relative w-full h-64 bg-gray-100" */>
        <Image
          src={artwork.image_path}
          alt={artwork.title}
          width={800}
          height={1200}
          sizes="50vw"
          quality={10}
          className="w-full h-auto block rounded-t-lg"
        />
      </div>
      
      <div className="p-3 space-y-1 bg-white" >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
            {artwork.title}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            By {artistName}
          </p>
        </div>
      </Link>

      {/* 3. Footer Price & Navigation */}
      <div className="px-4 pb-4 pt-0 flex items-center justify-between border-t border-gray-50 pt-3">
        <span className="font-extrabold text-xs text-purple-600">
          {artwork.price
            ? `${Number(artwork.price).toLocaleString()} LKR`
            : "Price on Request"}
        </span>

        <Link
          href={`/artworks/${artworkId}`}
          className="text-[11px] font-bold text-slate-700 hover:text-purple-600 uppercase tracking-wider inline-flex items-center gap-1 transition"
        >
          View
        </Link>
      </div>

    </div>
  );
}