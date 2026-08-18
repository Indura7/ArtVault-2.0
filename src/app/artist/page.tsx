'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, RotateCw, Sparkles, Filter, X } from 'lucide-react';
import ArtistCard, { Artist } from '@/components/modules/artist/artistcard';
import { supabase } from '@/lib/supabase';

// Curated default creators matching the design mockup precisely
const INITIAL_CREATORS: Artist[] = [
  {
    id: 'elena-vance',
    name: 'Elena Vance',
    handle: '@vance_studio',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    tags: ['ABSTRACT', 'MINIMALISM'],
    bio: "Specializing in monochromatic spatial explorations, Elena's work bridges the gap between physical architecture and human emotion through subtle geometric balances.",
    artworksCount: 124,
    category: 'Abstract & Minimalism',
    location: 'Berlin, Germany',
    email: 'elena@vance.studio',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=500&auto=format&fit=crop',
    ],
  },
  {
    id: 'kaito-morii',
    name: 'Kaito Morii',
    handle: '@kaito_vis',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800&auto=format&fit=crop',
    tags: ['SURREALISM', 'NEON-NOIR'],
    bio: "A pioneer of Neo-Tokyo surrealism, Kaito's digital pieces explore the intersection of artificial intelligence and organic consciousness with radiant neon palettes.",
    artworksCount: 89,
    category: 'Neon-Noir Digital Art',
    location: 'Tokyo, Japan',
    email: 'kaito@morii.design',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=500&auto=format&fit=crop',
    ],
  },
  {
    id: 'sarah-sterling',
    name: 'Sarah Sterling',
    handle: '@sterling_lens',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    tags: ['REALISM', 'DIGITAL PHOTO'],
    bio: 'Sarah captures the hyper-realistic textures of the natural world, focusing on macroscopic details that are often overlooked by the fast pace of modern life.',
    artworksCount: 210,
    category: 'Fine Art Photography',
    location: 'Vancouver, Canada',
    email: 'sarah@sterlinglens.art',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=500&auto=format&fit=crop',
    ],
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    handle: '@mchen_paints',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop',
    tags: ['EXPRESSIONISM'],
    bio: 'Marcus utilizes traditional oil techniques to recreate digital glitches, creating a jarring yet beautiful tension between classical craft and contemporary tech.',
    artworksCount: 56,
    category: 'Oil Expressionism',
    location: 'New York, USA',
    email: 'marcus@chenart.com',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?q=80&w=500&auto=format&fit=crop',
    ],
  },
  {
    id: 'zoe-aris',
    name: 'Zoe Aris',
    handle: '@aris_renders',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    tags: ['3D RENDERING', 'CYBERPUNK'],
    bio: 'Zoe creates hyper-detailed 3D environments that feel like forgotten memories of a future city, using complex lighting algorithms and architectural forms.',
    artworksCount: 142,
    category: 'Cyberpunk & 3D',
    location: 'London, UK',
    email: 'zoe@arisrenders.io',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=500&auto=format&fit=crop',
    ],
  },
  {
    id: 'lana-volkov',
    name: 'Lana Volkov',
    handle: '@volkov_brush',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    tags: ['IMPRESSIONISM'],
    bio: "Lana's impressionist landscapes are characterized by their dreamlike atmosphere and innovative use of color harmonies that transport viewers into peaceful realms.",
    artworksCount: 77,
    category: 'Impressionist Painting',
    location: 'Paris, France',
    email: 'lana@volkovfineart.fr',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop',
    ],
  },
];

const MORE_CREATORS: Artist[] = [
  {
    id: 'mateo-rossi',
    name: 'Mateo Rossi',
    handle: '@rossi_sculpt',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    tags: ['SCULPTURE', 'MODERNISM'],
    bio: 'Sculpting brutalist forms in bronze and recycled marble, Mateo questions permanency in a digital epoch.',
    artworksCount: 64,
    category: 'Sculpture & Modernism',
    location: 'Milan, Italy',
    email: 'mateo@rossisculpt.it',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=500&auto=format&fit=crop',
    ],
  },
  {
    id: 'amara-diallo',
    name: 'Amara Diallo',
    handle: '@amara_canvas',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    tags: ['CONTEMPORARY', 'AFRO-FUTURISM'],
    bio: 'Merging rich textile patterns with futuristic folklore, creating monumental canvases full of life and identity.',
    artworksCount: 95,
    category: 'Afro-Futurism',
    location: 'Dakar, Senegal',
    email: 'amara@diallo.art',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=500&auto=format&fit=crop',
    ],
  },
  {
    id: 'tariq-mansoor',
    name: 'Tariq Mansoor',
    handle: '@mansoor_calligraphy',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    tags: ['CALLIGRAPHY', 'MINIMALISM'],
    bio: 'Contemporary Arabic typography deconstructed into sweeping minimalist abstract ink strokes.',
    artworksCount: 112,
    category: 'Calligraphy',
    location: 'Dubai, UAE',
    email: 'tariq@mansoorart.ae',
    featuredArtworks: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=500&auto=format&fit=crop',
    ],
  },
];

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

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(INITIAL_CREATORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Fetch Supabase artists if available and prepend/merge with curated list
  useEffect(() => {
    async function loadDbArtists() {
      try {
        const { data, error } = await supabase.from('artist').select('*');
        if (!error && data && data.length > 0) {
          const dbArtistsMapped: Artist[] = data.map((dbA: any, i: number) => {
            const combinedName = `${dbA.first_name || ''} ${dbA.last_name || ''}`.trim();
            const name = dbA.full_name || dbA.display_name || (combinedName || `Artist ${i + 1}`);
            const handle = dbA.username || dbA.display_name?.toLowerCase().replace(/\s+/g, '_') || `artist_${dbA.id || i}`;
            const tags = dbA.category ? [dbA.category.toUpperCase()] : ['CONTEMPORARY'];
            return {
              id: dbA.id || `db-${i}`,
              name,
              handle: handle.startsWith('@') ? handle : `@${handle}`,
              image:
                dbA.avatar_url ||
                dbA.image_url ||
                dbA.image ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
              tags: tags,
              bio: dbA.bio || 'Passionate artist exploring modern aesthetics through creative compositions and authentic visual storytelling.',
              artworksCount: dbA.artworks_count || 12,
              category: dbA.category || 'Visual Arts',
              location: dbA.location || 'Global',
              email: dbA.email,
            };
          });

          // Avoid duplicates by handle or name
          setArtists((prev) => {
            const existingNames = new Set(prev.map((a) => a.name.toLowerCase()));
            const newOnes = dbArtistsMapped.filter((a) => !existingNames.has(a.name.toLowerCase()));
            return [...newOnes, ...prev];
          });
        }
      } catch (err) {
        console.error('Error fetching database artists:', err);
      }
    }

    loadDbArtists();
  }, []);

  // Filter logic
  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' ||
        artist.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()) ||
        (artist.category && artist.category.toLowerCase().includes(selectedCategory.toLowerCase()));

      return matchesSearch && matchesCategory;
    });
  }, [artists, searchQuery, selectedCategory]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setArtists((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const toAdd = MORE_CREATORS.filter((a) => !existingIds.has(a.id));
        return [...prev, ...toAdd];
      });
      setIsLoadingMore(false);
      setHasLoadedMore(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">
            The Creators
          </h1>
          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-1">
            <p>Discover the visionaries defining the next era of digital and traditional aesthetics.</p>
            <p className="text-slate-500">Filter by category or search for your favorite curators.</p>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creator by name, handle, or style..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs transition"
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

        {/* Creators Grid (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
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

        {/* Load More Pagination / Action Area */}
        <div className="flex flex-col items-center justify-center pt-8 pb-12 space-y-2">
          {!hasLoadedMore && filteredArtists.length >= 6 ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="group px-7 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-2.5 disabled:opacity-50"
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
            <div className="text-xs font-semibold text-slate-400">
              All featured artists displayed
            </div>
          )}

          <p className="text-xs text-slate-400">
            Showing {filteredArtists.length} of 1,280 Registered Artists
          </p>
        </div>

      </div>
    </div>
  );
}
