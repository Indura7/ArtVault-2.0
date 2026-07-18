'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; 

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
      // 📡 This is the actual live connection test query!
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
        <div className="grid gap-4">
          {artworks.map((art) => (
            <div key={art.art_id} className="p-4 border border-slate-200 rounded-xl shadow-sm bg-white">
              <h3 className="font-bold text-lg text-slate-800">{art.title}</h3>
              <p className="text-sm text-slate-500">{art.type}</p>
              <p className="text-purple-600 font-semibold mt-2">LKR {art.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}