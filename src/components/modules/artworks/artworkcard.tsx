import Image from "next/image";
import { User } from "lucide-react";

interface ArtworkProps {
  artwork: {
    art_id: number;
    title: string;
    type: string;        // e.g., "DIGITAL" or "PHYSICAL"
    image_path: string;  // Public URL from Supabase Storage
    price: number;
    artist_name?: string; // Fetched via JOIN from artist table
  };
}

export default function ArtworkCard({ artwork }: ArtworkProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-400 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Artwork Image */}
      <div className="relative w-full h-64 bg-gray-100">
        <Image
          src={artwork.image_path}
          alt={artwork.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2">
        {/* Title and Category Badge */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {artwork.title}
          </h3>
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
            {artwork.type}
          </span>
        </div>

        {/* Artist Name with Icon */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <User size={16} className="text-gray-500" />
          <span>{artwork.artist_name || "Artist name"}</span>
        </div>

        {/* Price */}
        <p className="text-sm font-medium text-blue-600">
          {artwork.price.toFixed(2)} LKR
        </p>
      </div>
    </div>
  );
}