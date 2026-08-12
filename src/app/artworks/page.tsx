'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; 
import Link from "next/link";
import ArtworkCard from "@/components/modules/artworks/artworkcard";

interface Artwork {
  art_id: number;
  title: string;
  type: string;
  price: number;
}

export default function BrowseArtPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getArtworks() {
      const { data, error } = await supabase
        .from('artwork')
        .select('art_id, title, type, price');

      if (error) {
        setError(error.message);
      } else {
        setArtworks(data || []);
      }
      setLoading(false);
    }

    getArtworks();
  }, []);

  if (loading) return <div className="p-10 text-center">Checking database connection... ⏳</div>;
  if (error) return <div className="p-10 text-center text-red-500">❌ Connection Error: {error}</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-purple-600">🔌 Database Connection Test</h1>
      {artworks.length === 0 ? (
        <p>Connected, but no artworks found!</p>
      ) : (
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
      )}
    </div>
  );
}