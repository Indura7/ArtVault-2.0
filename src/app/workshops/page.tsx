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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    async function getWorkshops() {
      const { data, error } = await supabase
        .from('workshop')
        .select('*, artist(*)');

      if (error) {
        setError(error.message);
      } else {
        setWorkshops(data || []);
        
        // get unique categories from the fetched workshops
        const uniqueCategories = Array.from(
          new Set(
            (data || [])
              .map((item: Workshop) => item.category)
              .filter(Boolean)
          )
        ) as string[];
        
        setCategories(uniqueCategories);
      }
      setLoading(false);
    }

    getWorkshops();
  }, []);

  // filter by search and category
  const filteredWorkshops = workshops.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.venue?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // change the filter or search term, reset to page 1
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  // Calculate the pagination
  const totalPages = Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedWorkshops = filteredWorkshops.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) return <div className="p-10 text-center">Loading workshops... ⏳</div>;
  if (error) return <div className="p-10 text-center text-red-500">❌ Error: {error}</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Title Section */}
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">
          Explore Workshops
        </h1>
        <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-1">
          <p>Discover creative workshops, master new skills, and learn directly from top artists.</p>
          <p className="text-slate-500">Filter by category or search for your favorite workshops.</p>
        </div>
      </div>

      {/* Filter & Search Bar Section */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between ">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search workshop title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">CATEGORY</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Cards Grid */}
      {paginatedWorkshops.length === 0 ? (
        <p className="text-slate-500 text-center py-10">No workshops found!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedWorkshops.map((item) => (
            <WorkshopCard key={item.workshop_id} workshop={item} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 mb-8">
          <button 
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition cursor-pointer"
          >
            Previous
          </button>
          
          <span className="text-sm font-bold text-gray-600">
            Page {page} of {totalPages}
          </span>
          
          <button 
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

    </main>
  );
}