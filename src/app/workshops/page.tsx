'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import WorkshopCard from '@/components/modules/workshops/workshopcard';
import { Search } from 'lucide-react';

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
  artist?: {
    first_name?: string;
    last_name?: string;
  };
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter workshops based on title, category, or venue
  const filteredWorkshops = workshops.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.venue?.toLowerCase().includes(term)
    );
  });



  if (loading) return <div className="p-10 text-center">Loading workshops... ⏳</div>;
  if (error) return <div className="p-10 text-center text-red-500">❌ Error: {error}</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header Section with Title & Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Workshops</h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover creative workshops, master new skills, and learn directly from top artists.
          </p>
        </div>
      
      
      {/* Search Input Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title, category, venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredWorkshops.length === 0 ? (
        <p className="text-slate-500 text-center py-10">No workshops found!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((item) => (
            <WorkshopCard key={item.workshop_id} workshop={item} />
          ))}
        </div>
      )}
    </main>
  );
}



