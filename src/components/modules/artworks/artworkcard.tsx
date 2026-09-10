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
          {artwork.medium?.medium_name && (
            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded uppercase">
              {artwork.medium.medium_name}
            </span>
          )}
        </div>
      

      {/* 3. Footer Price & Navigation */}
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <User size={16} className="text-gray-500" />
        <span>
          {artwork.artist?.first_name} {artwork.artist?.last_name}
        </span>
      </div>

        <div className="flex items-center justify-between ">
        <p className="text-sm font-medium text-blue-600">
          {artwork.price ? Number(artwork.price).toFixed(2) : "0.00"} LKR
        </p>

        <div className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition cursor-pointer">
           <Heart size={16} className="text-gray-500" />
          <span>{likeCount}</span>

        </div>
        </div>

       
      
      </div>
    </div>
  );
}