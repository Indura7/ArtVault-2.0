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

  async function fetchArtworks() {
    setLoading(true);
    const selectQuery = medium !== 'All'
    ? `*, artist(first_name, last_name), medium!inner(medium_name)`
    : `*, artist(first_name, last_name), medium(medium_name)`;
    
    let query = supabase.from("artwork").select(selectQuery);


    if (search.trim() !== '') query = query.ilike('title', `%${search}%`);
    if (medium !== 'All') query = query.ilike('medium.medium_name', medium);  

    switch (sortBy) {
      case 'newest': query = query.order('date_added', { ascending: false }); break;
      case 'oldest': query = query.order('date_added', { ascending: true }); break;
      case 'price_low': query = query.order('price', { ascending: true }); break;
      case 'price_high': query = query.order('price', { ascending: false }); break;
    }

    const { data, error } = await query;
    if (!error && data) setArtworks(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchArtworks();
  }, [search, medium, sortBy]);





  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6"> Explore Artworks</h1>
      <Link href={'/artworks/upload'}> 
        <button>
          Add Artwork
        </button>
      </Link>

      <ArtworkFilters 
        search={search} 
        setSearch={setSearch} 
        medium={medium} 
        setMedium={setMedium} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />
      
      

      <div className="columns-1  sm:columns-2 lg:columns-4 gap-6 ">  
        {/* 1 columns in mobiles ,2 colums in tablets and 4 colums in desktops */}

        {artworks?.map((item) => (

          <div key={item.art_id} className='break-inside-avoid p-3'>
          <Link key={item.art_id} href={`/artworks/${item.art_id}`}>
          <ArtworkCard key={item.art_id} artwork={item} />
          </Link>
          </div>
        ))}
      </div>

      


    </div>
  );
}