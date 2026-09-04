'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 
import ArtworkCard from "@/components/modules/artworks/artworkcard";
import ArtworkFilters from "@/components/modules/artworks/artworkfilter";
import Link from "next/link";


export default function ArtworksPage() {
/*   const { data: artworks, error } = await supabase
.from("artwork")
.select(`*,
      artist(first_name,last_name)`);

  if (error) {
    console.error("Error fetching artworks:", error);
  } */

  const [artworks, setArtworks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [medium, setMedium] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 8;

  async function fetchArtworks() {
    setLoading(true);
    const selectQuery = medium !== 'All'
    ? `*, artist(first_name, last_name), medium!inner(medium_name)`
    : `*, artist(first_name, last_name), medium(medium_name)`;
    
    let query = supabase.from("artwork").select(selectQuery, { count: 'exact' });


    if (search.trim() !== '') query = query.ilike('title', `%${search}%`);
    if (medium !== 'All') query = query.ilike('medium.medium_name', medium);  

    switch (sortBy) {
      case 'newest': query = query.order('date_added', { ascending: false }); break;
      case 'oldest': query = query.order('date_added', { ascending: true }); break;
      case 'price_low': query = query.order('price', { ascending: true }); break;
      case 'price_high': query = query.order('price', { ascending: false }); break;
    }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  query = query.range(from, to);

    const { data,count, error } = await query;
    if (!error && data) setArtworks(data);
    setLoading(false);
    if (count !== null) setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
  }

  useEffect(() => {
    fetchArtworks();
  }, [search, medium, sortBy, page]);





  return (
    <div className="container mx-auto p-6">
      
      {/* <Link href={'/artworks/upload'}> 
        <button>
          Add Artwork
        </button>
      </Link> */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">
            Explore Artworks
          </h1>
          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-1">
            <p>Discover the visionaries defining the next era of digital and traditional aesthetics.</p>
            <p className="text-slate-500">Filter by category or search for your favorite artworks.</p>
          </div>
        </div>
      <ArtworkFilters 
        search={search} 
        setSearch={setSearch} 
        medium={medium} 
        setMedium={setMedium} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />
      
      

      <div className="columns-1  sm:columns-2 lg:columns-4 gap-1 ">  
        {/* 1 columns in mobiles ,2 colums in tablets and 4 colums in desktops */}

        {artworks?.map((item) => (

          <div key={item.art_id} className='break-inside-avoid p-3'>
          <Link key={item.art_id} href={`/artworks/${item.art_id}`}>
          <ArtworkCard key={item.art_id} artwork={item} />
          </Link>
          </div>
        ))}
      </div>

      


      <div className="columns-1 sm:columns-2 lg:columns-4 gap-6">  
        {/* ... */}
      </div>
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 mb-8">
          <button 
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-200 transition rounded-lg"
          >
            Previous
          </button>
          
          <span className="text-sm font-bold text-gray-600">
            Page {page} of {totalPages}
          </span>
          
          <button 
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-200 transition"
          >
            Next
          </button>
        </div>
      )}


    </div>
  );
}