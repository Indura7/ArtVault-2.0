"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  DollarSign, 
  Eye, 
  Clock, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  Video,
  Calendar,
  Users
} from "lucide-react";

export default function ArtistDashboard() {
  // State for switching between 'artworks' and 'workshops' tabs
  const [activeTab, setActiveTab] = useState<"artworks" | "workshops">("artworks");
  
  // States to hold database data and loading status
  const [artworks, setArtworks] = useState<any[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalArtworks: 0,
    workshopsHosted: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch artist-specific data from Supabase when the component loads
  useEffect(() => {
    async function fetchArtistSpecificData() {
      try {
        setLoading(true);

        // 1. Get the currently logged-in user from Supabase Auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.warn("No user logged in!");
          setLoading(false);
          return;
        }

        // 2. Fetch the artist profile linked to this user's ID
        const { data: artistData, error: artistErr } = await supabase
          .from('artist')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (artistErr || !artistData) {
          console.warn("Artist profile not found for this user");
          setLoading(false);
          return;
        }

        const currentArtistId = artistData.id; // The actual artist ID from the database

        // 3. Fetch artworks belonging ONLY to this specific artist
        const { data: artData, error: artError } = await supabase
          .from('artwork')
          .select('*')
          .eq('artist_id', currentArtistId); // Filter by logged-in artist's ID

        if (artError) {
          console.error('Error fetching artworks:', artError.message);
        } else {
          setArtworks(artData || []);
        }

        // 4. Fetch workshops hosted ONLY by this specific artist
        const { data: wsData, error: wsError } = await supabase
          .from('workshop')
          .select('*')
          .eq('artist_id', currentArtistId); // Filter by logged-in artist's ID

        if (wsError) {
          console.error('Error fetching workshops:', wsError.message);
        } else {
          setWorkshops(wsData || []);
        }

        // 5. Calculate and update overview stats metrics
        const totalArts = artData ? artData.length : 0;
        const totalWs = wsData ? wsData.length : 0;
        const pendingCount = artData?.filter((a: any) => a.status === 'Pending').length || 0;

        setStats({
          totalArtworks: totalArts,
          workshopsHosted: totalWs,
          totalRevenue: 145000, // Can be calculated from orders table if needed
          pendingApprovals: pendingCount
        });

      } catch (err) {
        console.error('Unexpected error loading dashboard data:', err);
      } finally {
        setLoading(false); // Stop loading spinner once fetch is complete
      }
    }

    fetchArtistSpecificData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">

      {/* Header Bar */}
      <div className="bg-white border-b border-gray-100 py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 mb-2 transition"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Artist Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage your portfolio, host interactive workshops, and track your creative stats.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              href="/artworks/upload" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-purple-200"
            >
               <PlusCircle size={15} />
               Upload New Art
            </Link>
            
            <Link 
              href="/workshops/create" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-purple-200"
            >
              <Video size={15} />
              Create Workshop
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-8 space-y-8">
        
        {/* Stats Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ImageIcon size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Artworks</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalArtworks}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Workshops Hosted</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.workshopsHosted}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">LKR {stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.pendingApprovals}</h3>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="border-b border-gray-200 flex items-center gap-8">
          <button
            onClick={() => setActiveTab("artworks")}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === "artworks"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            My Artworks ({artworks.length})
          </button>
          
          <button
            onClick={() => setActiveTab("workshops")}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === "workshops"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            My Workshops ({workshops.length})
          </button>
        </div>

        {/* Loading state indicator */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Loading your dashboard data...</div>
        ) : (
          <>
            {/* TAB 1: ARTWORKS GRID */}
            {activeTab === "artworks" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.length === 0 ? (
                  <p className="text-gray-500 text-sm">No artworks found. Upload your first artwork!</p>
                ) : (
                  artworks.map((art) => (
                    <div key={art.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                        <img src={art.image_url || art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          art.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {art.status || 'Pending'}
                        </span>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif font-bold text-base text-slate-900 truncate">{art.title}</h3>
                          <span className="font-bold text-xs text-purple-600">LKR {art.price}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Eye size={14} /> {art.views || 0} views</span>
                          <div className="flex gap-2">
                            <button className="p-1 hover:text-purple-600"><Edit3 size={15} /></button>
                            <button className="p-1 hover:text-rose-600"><Trash2 size={15} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: WORKSHOPS GRID */}
            {activeTab === "workshops" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.length === 0 ? (
                  <p className="text-gray-500 text-sm">No workshops found. Create your first workshop!</p>
                ) : (
                  workshops.map((ws) => (
                    <div key={ws.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                        <img src={ws.image_url || ws.image} alt={ws.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          ws.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {ws.status || 'Pending'}
                        </span>
                      </div>
                      <div className="p-5 space-y-3">
                        <h3 className="font-serif font-bold text-base text-slate-900 truncate">{ws.title}</h3>
                        <div className="space-y-1.5 text-xs text-gray-500">
                          <p className="flex items-center gap-2"><Calendar size={14} className="text-purple-600" /> {ws.date} at {ws.time}</p>
                          <p className="flex items-center gap-2"><Users size={14} className="text-purple-600" /> {ws.participants || 0} Registered</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                          <span className="font-bold text-purple-600">LKR {ws.price}</span>
                          <div className="flex gap-2">
                            <button className="p-1 hover:text-purple-600"><Edit3 size={15} /></button>
                            <button className="p-1 hover:text-rose-600"><Trash2 size={15} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}