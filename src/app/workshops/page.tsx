'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import WorkshopCard from '@/components/modules/workshops/workshopcard';

export interface Workshop {
  workshop_id: number;
  title: string;
  description?: string;
  price?: number;
  location?: string;
  image_url?: string;
  category?: string;
  seats_left?: number;
  date?: string;
  venue?: string;
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getWorkshops() {
      const { data, error } = await supabase
        .from('workshop')
        .select('*, artist(*)');

      if (error) {
        setError(error.message);
      } else {
        setWorkshops(data || []);
      }
      setLoading(false);
    }

    getWorkshops();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading workshops... ⏳</div>;
  if (error) return <div className="p-10 text-center text-red-500">❌ Error: {error}</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Workshops</h2>
      
      {workshops.length === 0 ? (
        <p className="text-slate-500">No workshops found!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((item) => (
            <WorkshopCard key={item.workshop_id} workshop={item} />
          ))}
        </div>
      )}
    </main>
  );
}



