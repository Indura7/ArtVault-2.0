import Image from "next/image";
import { Heart, Calendar, User, Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // Fetch live data from artwork, artist, and workshop tables
  const [
    { data: dbArtworks, error: artworkError },
    { data: dbArtists, error: artistError },
    { data: dbWorkshops, error: workshopError },
  ] = await Promise.all([
    supabase.from("artwork").select("*"),
    supabase.from("artist").select("*"),
    supabase.from("workshop").select("*"),
  ]);

  const hasError = artworkError || artistError || workshopError;

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      
      {/* DB Connection Status Banner */}
      <div className="max-w-6xl mx-auto px-6 pt-4">
        {hasError ? (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
            ⚠️ Connection Notice: {artworkError?.message || artistError?.message || workshopError?.message}
          </div>
        ) : (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-md font-mono flex justify-between items-center">
            <span>✅ Connected to Supabase Database</span>
            <span className="text-[11px] opacity-80">
              Loaded: {dbArtworks?.length || 0} Artworks | {dbArtists?.length || 0} Artists | {dbWorkshops?.length || 0} Workshops
            </span>
          </div>
        )}
      </div>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-purple-100 via-purple-50/50 to-white py-20 px-6 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto z-10 relative">
          <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
            Discover Beautiful Art
          </span>
          <h1 className="text-5xl font-serif text-gray-900 mt-2">
            Art That <span className="text-pink-500 italic">Inspires You</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
            Explore original artworks, connect with talented artists, and join exciting workshops in a secure, curated digital gallery experience.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-6 py-3 bg-indigo-700 text-white text-xs font-semibold tracking-wider rounded-md hover:bg-indigo-800 transition">
              EXPLORE GALLERY
            </button>
            <button className="px-6 py-3 border border-gray-300 bg-white/80 text-gray-700 text-xs font-semibold tracking-wider rounded-md hover:bg-white transition">
              View Workshops
            </button>
          </div>
        </div>
      </section>

      {/* 1. FEATURED ARTWORKS FROM DATABASE */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Featured Artworks</h2>
          <a href="#" className="text-xs font-semibold text-blue-500 hover:underline">
            View All Arts ({dbArtworks?.length || 0})
          </a>
        </div>

        {dbArtworks && dbArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {dbArtworks.map((art: any, index: number) => (
              <div 
                key={art.id || art.artwork_id || index} 
                className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="relative h-64 bg-gray-100">
                  <img 
                    src={art.image_url || art.image || art.photo || "https://images.unsplash.com/photo-1541701494587-cb58502866ab"} 
                    alt={art.title || "Artwork"} 
                    className="w-full h-full object-cover" 
                  />
                  {art.status && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-600">
                      {art.status}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                    {art.category || art.genre || "PAINTING"}
                  </span>
                  <h3 className="font-serif font-bold text-gray-800 text-base">{art.title || art.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    by {art.artist_name || art.artist || art.artist_id || "Unknown Artist"}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="font-semibold text-sm text-gray-900">
                      {art.price ? `$${art.price}` : "Inquire for Price"}
                    </span>
                    <button className="text-gray-400 hover:text-red-500 transition">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No artworks found in database table <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">artwork</code>.</p>
          </div>
        )}
      </section>

      {/* 2. MEET OUR ARTISTS FROM DATABASE */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-100">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">Meet Our Artists</h2>
            <p className="text-xs text-gray-500 mt-1">
              The brilliant minds pushing the boundaries of contemporary and digital art.
            </p>
          </div>
          <a href="#" className="text-xs font-semibold text-blue-500 hover:underline">
            View All Artists ({dbArtists?.length || 0})
          </a>
        </div>

        {dbArtists && dbArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dbArtists.map((artist: any, index: number) => {
              // Try common column names for the artist's name,
              // falling back to combining first_name + last_name
              const combinedName = `${artist.first_name || ""} ${artist.last_name || ""}`.trim();

              const artistName =
                artist.name ||
                artist.artist_name ||
                artist.full_name ||
                artist.username ||
                artist.title ||
                (combinedName.length > 0 ? combinedName : null);

              return (
                <div 
                  key={artist.id || artist.artist_id || index} 
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-28 h-28 rounded-full p-1 border-2 border-dashed border-blue-400 mb-4 overflow-hidden">
                    <img 
                      src={artist.image_url || artist.image || artist.profile_image || artist.photo_url || artist.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} 
                      alt={artistName || "Artist"} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  </div>
                  
                  <h3 className="font-serif font-bold text-gray-800 text-lg">
                    {artistName || "Unnamed Artist"}
                  </h3>

                  <span className="text-[10px] font-bold text-pink-500 tracking-wider uppercase mb-2 mt-1">
                    {artist.specialty || artist.category || "CONTEMPORARY ARTIST"}
                  </span>
                  <p className="text-xs text-gray-500 italic max-w-xs mb-3">
                    {artist.bio || artist.quote || artist.description || "No biography available."}
                  </p>
                  <a href="#" className="text-xs font-semibold text-blue-500 hover:underline">
                    View Profile
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No artists found in database table <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">artist</code>.</p>
          </div>
        )}
      </section>

      {/* 3. UPCOMING WORKSHOPS FROM DATABASE */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">Upcoming Workshops</h2>
            <p className="text-xs text-gray-500 mt-1">Learn from the masters in exclusive, small-group sessions.</p>
          </div>
          <a href="#" className="text-xs font-semibold text-blue-500 hover:underline">
            View All Workshops ({dbWorkshops?.length || 0})
          </a>
        </div>

        {dbWorkshops && dbWorkshops.length > 0 ? (
          <div className="space-y-6">
            {dbWorkshops.map((ws: any, index: number) => (
              <div 
                key={ws.id || ws.workshop_id || index} 
                className="flex flex-col md:flex-row bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="md:w-1/3 h-48 md:h-auto bg-gray-100">
                  <img 
                    src={ws.image_url || ws.image || "https://images.unsplash.com/photo-1626785774573-4b799315345d"} 
                    alt={ws.title || ws.name || "Workshop"} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-3 text-[10px] font-bold mb-2">
                      <span className="text-pink-500 uppercase tracking-wider">{ws.category || "MASTERCLASS"}</span>
                      {ws.date && (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> {ws.date}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-gray-800 mb-2">{ws.title || ws.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{ws.description || "No workshop description available."}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <span className="text-xs font-bold text-blue-500 flex items-center gap-1">
                      <User size={14} /> {ws.seats || ws.capacity ? `${ws.seats || ws.capacity} Seats` : "Available"}
                    </span>
                    <button className="px-5 py-2 bg-indigo-700 text-white text-xs font-semibold tracking-wider rounded-md hover:bg-indigo-800 transition">
                      BOOK SEAT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No workshops found in database table <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">workshop</code>.</p>
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-500 text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
            <Bell size={20} className="text-white" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-3">Stay Informed & Inspired</h2>
          <p className="text-xs text-purple-100 leading-relaxed mb-8 max-w-lg">
            Our intelligent notification system ensures you're always connected to the artists and events you love.
          </p>
          <button className="px-8 py-3 bg-white text-gray-900 text-xs font-bold rounded-full hover:bg-gray-100 transition shadow-lg">
            Join the Community
          </button>
        </div>
      </section>
    </div>
  );
}
