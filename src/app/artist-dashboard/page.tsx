"use client";

import React, { useState } from "react";
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
  Users
} from "lucide-react";

// Sample Data
const sampleArtworks = [
  {
    id: "1",
    title: "Serenade of Silence",
    price: "LKR 25,000",
    status: "Approved",
    views: 142,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "2",
    title: "Vibrant Echoes",
    price: "LKR 18,000",
    status: "Pending",
    views: 29,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=500&q=80",
  },
];

const sampleWorkshops = [
  {
    id: "w1",
    title: "Digital Sculpting Masterclass",
    date: "2026-09-15",
    time: "10:00 AM",
    price: "LKR 5,000",
    participants: 18,
    status: "Approved",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "w2",
    title: "Watercolor Techniques for Beginners",
    date: "2026-10-02",
    time: "02:00 PM",
    price: "LKR 3,500",
    participants: 8,
    status: "Pending",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80",
  }
];

export default function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState<"artworks" | "workshops">("artworks");

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
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">12</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Workshops Hosted</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">5</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">LKR 145,000</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">2</h3>
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
            My Artworks ({sampleArtworks.length})
          </button>
          
          <button
            onClick={() => setActiveTab("workshops")}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === "workshops"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            My Workshops ({sampleWorkshops.length})
          </button>
        </div>

        {/* TAB 1: ARTWORKS GRID */}
        {activeTab === "artworks" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleArtworks.map((art) => (
              <div key={art.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    art.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {art.status}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-slate-900 truncate">{art.title}</h3>
                    <span className="font-bold text-xs text-purple-600">{art.price}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Eye size={14} /> {art.views} views</span>
                    <div className="flex gap-2">
                      <button className="p-1 hover:text-purple-600"><Edit3 size={15} /></button>
                      <button className="p-1 hover:text-rose-600"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: WORKSHOPS GRID */}
        {activeTab === "workshops" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleWorkshops.map((ws) => (
              <div key={ws.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img src={ws.image} alt={ws.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    ws.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ws.status}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-serif font-bold text-base text-slate-900 truncate">{ws.title}</h3>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <p className="flex items-center gap-2"><Calendar size={14} className="text-purple-600" /> {ws.date} at {ws.time}</p>
                    <p className="flex items-center gap-2"><Users size={14} className="text-purple-600" /> {ws.participants} Registered</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <span className="font-bold text-purple-600">{ws.price}</span>
                    <div className="flex gap-2">
                      <button className="p-1 hover:text-purple-600"><Edit3 size={15} /></button>
                      <button className="p-1 hover:text-rose-600"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}