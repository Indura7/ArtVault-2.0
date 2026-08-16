import Image from "next/image";
import { User } from "lucide-react";

interface ArtworkProps {
  artwork: {
    art_id: number;
    title: string;
    medium: string;        
    image_path: string;  
    price: number;
    artist:{
        first_name:string;
        last_name:string;
    }; 
  };
}

export default function ArtworkCard({ artwork }: ArtworkProps) {
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

      
      <div className="p-4 space-y-2 bg-white" >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {artwork.title} 
          </h3>
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
            {artwork.medium}
          </span>
        </div>

        
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <User size={16} className="text-gray-500" />
        <span>
            {artwork.artist?.first_name} {artwork.artist?.last_name} 
        </span>
        </div>

        {/* Price */}
        <p className="text-sm font-medium text-blue-600">
          {artwork.price.toFixed(2)} LKR
        </p>
      </div>
    </div>
  );
}