'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, RotateCw, Sparkles, Filter, X } from 'lucide-react';
import ArtistCard, { Artist } from '@/components/modules/artist/artistcard';
import { ArtistProfile, INITIAL_CREATORS } from '@/lib/artists-data';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  'All',
  'Abstract',
  'Minimalism',
  'Surrealism',
  'Neon-Noir',
  'Realism',
  'Digital Photo',
  'Expressionism',
  '3D Rendering',
  'Cyberpunk',
  'Impressionism',
];

export default function AllArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Fetch Supabase artists if available and prepend/merge with curated list
  useEffect(() => {
    async function loadDbArtists() {
      try {
        const { data, error } = await supabase.from('artist').select('*');

        if (error) {
          console.error('[AllArtistsPage] failed to fetch artists:', error.message);
          return;
        }

        if (data && data.length > 0) {
          // Log the shape of the first row once — check devtools to confirm
          // which columns actually exist (id, avatar_url, bio, etc.)
          console.log('[AllArtistsPage] sample artist row:', data[0]);

          const dbArtistsMapped: Artist[] = data
            .map((dbA: any, i: number) => {
              // Resolve the REAL primary key. Never invent one (e.g. `db-${i}`) —
              // a fabricated id can never match a row and breaks the profile link.
              const realId = dbA.id ?? dbA.artist_id ?? dbA.uuid ?? dbA.artist_uuid ?? null;

              if (realId === null || realId === undefined || realId === '') {
                console.warn('[AllArtistsPage] skipping artist with no usable primary key:', dbA);
                return null;
              }

              const combinedName = `${dbA.first_name || ''} ${dbA.last_name || ''}`.trim();
              const name = dbA.full_name || dbA.display_name || combinedName || `Artist ${i + 1}`;
              const handle =
                dbA.username || dbA.display_name?.toLowerCase().replace(/\s+/g, '_') || `artist_${realId}`;
              const tags = dbA.category ? [dbA.category.toUpperCase()] : ['CONTEMPORARY'];

              return {
                id: String(realId),
                name,
                handle: handle.startsWith('@') ? handle : `@${handle}`,
                image:
                  dbA.avatar_url ||
                  dbA.profile_image ||
                  dbA.image_url ||
                  dbA.image ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
                tags,
                bio:
                  dbA.bio ||
                  'Passionate artist exploring modern aesthetics through creative compositions and authentic visual storytelling.',
                artworksCount: dbA.artworks_count ?? dbA.artwork_count ?? 12,
                category: dbA.category || 'Visual Arts',
                location: dbA.location || 'Global',
                email: dbA.email,
              } as Artist;
            })
            .filter((a): a is Artist => a !== null);

          // Avoid duplicates by name
          setArtists((prev) => {
            const existingNames = new Set(prev.map((a) => a.name?.toLowerCase()));
            const newOnes = dbArtistsMapped.filter((a) => !existingNames.has(a.name?.toLowerCase()));
            return [...newOnes, ...prev];
          });
        }
      } catch (err) {
        console.error('Error fetching database artists:', err);
      }
    }

    loadDbArtists();
  }, []);

  // Filter logic — also strips any stray undefined/null entries defensively
  const filteredArtists = useMemo(() => {
    return artists
      .filter((artist): artist is Artist => !!artist)
      .filter((artist) => {
        const name = artist.name || '';
        const handle = artist.handle || '';
        const bio = artist.bio || '';
        const tags = artist.tags || [];

        const matchesSearch =
          searchQuery.trim() === '' ||
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'All' ||
          tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()) ||
          (artist.category && artist.category.toLowerCase().includes(selectedCategory.toLowerCase()));

        return matchesSearch && matchesCategory;
      });
  }, [artists, searchQuery, selectedCategory]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      
      setArtists(INITIAL_CREATORS.filter((a): a is ArtistProfile => !!a && typeof a === 'object'));
      setIsLoadingMore(false);
      setHasLoadedMore(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-9">

        {/* Header Section */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">
            The Creators
          </h1>
          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-1">
            <p>Discover the visionaries defining the next era of digital and traditional aesthetics.</p>
            <p className="text-slate-500">Filter by category or search for your favorite curators.</p>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 pt-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creator by name, handle, or style..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Quick Status / Total Count */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Sparkles size={14} className="text-blue-600" />
              <span>Showing {filteredArtists.length} Curated Artists</span>
            </div>
          </div>

          {/* Category Pills Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter size={14} className="text-slate-400 flex-shrink-0 ml-1 hidden sm:block" />
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Creators Grid: 3 columns matching the uploaded screenshot */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id || artist.name} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
            <p className="text-base font-semibold text-slate-800">No creators found matching your filter.</p>
            <p className="text-xs text-slate-500">Try searching with different keywords or reset the category filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Pagination Button matching the mockup */}
        <div className="flex flex-col items-center justify-center pt-8 pb-12 space-y-2.5">
          {!hasLoadedMore && filteredArtists.length >= 6 ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="group px-8 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-2.5 disabled:opacity-50"
            >
              <span>{isLoadingMore ? 'LOADING CREATORS...' : 'LOAD MORE ARTISTS'}</span>
              <RotateCw
                size={14}
                className={`text-slate-500 group-hover:text-slate-900 transition-transform ${
                  isLoadingMore ? 'animate-spin' : 'group-hover:rotate-180 duration-500'
                }`}
              />
            </button>
          ) : (
            <div className="text-xs font-semibold text-slate-400">All featured artists displayed</div>
          )}

          <p className="text-xs text-slate-400">
            Showing {filteredArtists.length} of 1,280 Registered Artists
          </p>
        </div>

      </div>
    </div>
  );
}