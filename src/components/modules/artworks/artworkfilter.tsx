'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ArtworkFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  medium: string;
  setMedium: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

interface MediumItem {
  medium_id: number;
  medium_name: string;
}

export default function ArtworkFilters({
  search,
  setSearch,
  medium,
  setMedium,
  sortBy,
  setSortBy,
}: ArtworkFiltersProps) {
    const [categories, setCategories] = useState<MediumItem[]>([]);

    useEffect(() => {
    async function loadMediums() {
      const { data, error } = await supabase
        .from('medium')
        .select('*')
        .order('medium_name', { ascending: true });

      if (!error && data) {
        setCategories(data);
      }
    }
    loadMediums();
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-fuchsia-50 p-4 rounded-lg ">
      
      {/* 🔍 Search Input */}
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Search artwork title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
        <select 
          value={medium} 
          onChange={(e) => setMedium(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md bg-white text-sm focus:outline-none"
        >
          <option value="All">All Categories</option>
          
          {categories.map((cat) => (
            <option key={cat.medium_id} value={cat.medium_name}>
              {cat.medium_name}
            </option>
          ))}
        </select>
      </div>

      
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Sort By</label>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md bg-white text-sm focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

    </div>
  );
}