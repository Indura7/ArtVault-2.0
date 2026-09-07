'use client';

import React from 'react';
import Link from 'next/link';

interface ArtworkCardProps {
  artwork: any;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const artworkId = artwork.art_id || artwork.id;
  const artistName = artwork.artist
    ? `${artwork.artist.first_name || ''} ${artwork.artist.last_name || ''}`.trim()
    : artwork.artist_name || 'Unknown Artist';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 group relative flex flex-col justify-between">
      
      

      {/* 2. Main Link wrapping only Image & Title */}
      <Link href={`/artworks/${artworkId}`} className="block flex-1">
        <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
          <img
            src={artwork.image_path || artwork.image || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119"}
            alt={artwork.title || "Artwork"}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        <div className="p-4 space-y-1">
          <h3 className="font-serif font-bold text-sm text-slate-900 truncate group-hover:text-purple-600 transition">
            {artwork.title || "Untitled Artwork"}
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