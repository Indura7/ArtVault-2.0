/*'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Workshop {
  id: number; 
  title: string;
  description?: string;
  price?: number;
  location?: string;
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getWorkshops() {
      
      const { data, error } = await supabase
        .from('workshop') 
        .select('*');

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
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-purple-600"> Explore Workshops</h1>


      
      {workshops.length === 0 ? (
        <p>Connected, but no workshops found!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {workshops.map((item) => (
            <div key={item.id} className="p-4 border border-slate-200 rounded-xl shadow-sm bg-white">
              <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
              )}
              {item.location && (
                <p className="text-xs text-slate-400 mt-2">📍 {item.location}</p>
              )}
              {item.price !== undefined && (
                <p className="text-purple-600 font-semibold mt-2">LKR {item.price}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}*/


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
        .select('*');

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



