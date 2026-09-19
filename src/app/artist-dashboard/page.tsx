"use client";

import React, { useState,useEffect } from "react";
import Link from "next/link";
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
  Users,
  Brush,
  SquareCheckBig,
  PiggyBank, 
} from "lucide-react";
import {supabase} from "@/lib/supabase";


export default function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState<"artworks" | "workshops">("artworks");
  const [artistProfile, setArtistProfile] = useState<{ firstName: string, lastName: string, avatarUrl: string | null } | null>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const totalArtworks = artworks.length;
  const approvedArtworks = artworks.filter(art => art.status === 'Approved').length;
  const pendingApprovals = artworks.filter(art => art.status === 'Pending').length;
  const totalWorkshops = workshops.length;
  const totalRevenue = artworks.reduce((sum, art) => sum + (art.price), 0);
  const totalAssetValue = artworks.reduce((sum, art) => sum + (Number(art.price) || 0), 0);

  useEffect(() => {
    const fetchArtistData = async () => {
      setIsLoading(true);
      
      // 1. Get Logged-in User
      const { data: { user } } = await supabase.auth.getUser();

      if (!user){ 
        setIsLoading(false);
        return; 
      }

      // 2. Get Artist Data
      const { data: artistData } = await supabase
        .from("artist")
        .select("artist_id, first_name, last_name, avatar_url") 
        .eq("auth_id", user.id)
        .single();

      if (artistData) {
        const artistId = artistData.artist_id;
        setActiveUserId(artistId);
        
        // Save the real profile data to state
        setArtistProfile({
          firstName: artistData.first_name,
          lastName: artistData.last_name,
          avatarUrl: artistData.avatar_url 
        });

        // 3. Fetch ONLY this artist's artworks
        const { data: artData, error } = await supabase
          .from("artwork")
          .select("*")
          .eq("artist_id", artistId)
          ;

        if (artData && !error) {
          setArtworks(artData);
        } else if (error) {
          console.error("Error fetching artworks:", error);
        }
      }

      setIsLoading(false);
    };

    fetchArtistData();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">

      {/* Header Bar */}
      <div className="bg-white border-b border-gray-100 py-6 px-6 sm:px-12">
        
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className=" gap-4">
             <Link href="/" className="inline-flex items-center gap-2 pb-5 text-xs font-semibold text-gray-500 hover:text-purple-600 mb-1 transition">
                <ArrowLeft size={12} /> Back to Home
              </Link>
            <div className="w-40 h-40  border-purple-200 rounded-lg rectangle-full bg-purple-100 flex items-center m-5 justify-center overflow-hidden border-2 border-purple-200 shrink-0 shadow-sm">
              {artistProfile?.avatarUrl ? (
                <img src={artistProfile.avatarUrl} alt="Artist Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-purple-700 uppercase">
                  {artistProfile?.firstName?.charAt(0) || "A"} 
                </span>
              )}
            </div>
            
            {/* Greeting Text */}
            <div>
             
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Welcome back, {artistProfile ? artistProfile.firstName : "Artist"}! 
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Manage your portfolio, host interactive workshops, and track your creative stats.
              </p>
            </div>
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
              <Brush size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Artworks</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalArtworks}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <SquareCheckBig size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">APPROVED ARTWORKS</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{approvedArtworks}</h3>
            </div>
          </div>
          
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{pendingApprovals}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Workshops Hosted</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalWorkshops}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PiggyBank size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Asset</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">LKR {totalAssetValue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Income</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">LKR {totalRevenue.toLocaleString()}</h3>
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

        {/* TAB 1: ARTWORKS GRID */}
        {activeTab === "artworks" && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="text-gray-500 font-semibold">Loading your artworks...</p>
            ) : artworks.length === 0 ? (
              <p className="text-gray-500 italic">No artworks found. Upload your first piece!</p>
            ) : (
              
              artworks.map((art) => (
                // 👇 Changed art.id to art.artwork_id (or whatever your DB primary key is!)
                <div key={art.art_id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img src={art.image_path } 
                    alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      art.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {art.status}
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-base text-slate-900 truncate">{art.title}</h3>
                      <span className="font-bold text-xs text-purple-600">LKR {art.price}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={14} className="text-purple-600" /> {art.date_added}</span>
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
        {activeTab === "workshops" && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="text-gray-500 font-semibold">Loading your workshops...</p>
            ) : workshops.length === 0 ? (
              <p className="text-gray-500 italic">No workshops scheduled yet. Create one today!</p>
            ) : (
              // 👇 Changed from sampleWorkshops.map to workshops.map
              workshops.map((ws) => (
                // 👇 Make sure ws.workshop_id matches your DB primary key!
                <div key={ws.workshop_id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img src={ws.image_url} alt={ws.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-serif font-bold text-base text-slate-900 truncate">{ws.title}</h3>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <p className="flex items-center gap-2"><Calendar size={14} className="text-purple-600" /> {ws.date_added}</p>
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
      </div>
    </div>
  );
}
