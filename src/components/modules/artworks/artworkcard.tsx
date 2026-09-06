import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import FavoriteButton from "@/components/modules/customer/wishlist";

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
  return (
    <div className="card bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 relative group">
      <div className="relative w-full h-64 bg-gray-100">
        <Link href={`/artworks/${artwork.art_id}`} className="block w-full h-full">
          <Image
            src={artwork.image_path}
            alt={artwork.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </Link>
        {/* Floating Heart Button */}
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full shadow z-10">
          <FavoriteButton artworkId={artwork.art_id} />
        </div>
      </div>

      <Link href={`/artworks/${artwork.art_id}`} className="block p-4 space-y-2 bg-white">
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

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <User size={16} className="text-gray-500" />
          <span>
            {artwork.artist?.first_name} {artwork.artist?.last_name}
          </span>
        </div>

        <p className="text-sm font-medium text-blue-600">
          {artwork.price ? Number(artwork.price).toFixed(2) : "0.00"} LKR
        </p>
      </Link>
    </div>
  );
}