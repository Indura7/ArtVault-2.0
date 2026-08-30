"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Video, 
  Heart, 
  DollarSign, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  ArrowLeft,
  ExternalLink,
  Clock,
  CheckCircle2,
  Package
} from "lucide-react";

// Sample Customer Data
const customerDetails = {
  name: "Githara Sandali",
  email: "githara@example.com",
  phone: "+94 77 123 4567",
  address: "Colombo, Sri Lanka",
  joinedDate: "March 2026",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
};

// Purchased Artworks Sample Data
const samplePurchases = [
  {
    id: "ord-101",
    title: "Serenade of Silence",
    artist: "Kasun Kalhara",
    price: "LKR 25,000",
    date: "2026-07-12",
    status: "Delivered",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "ord-102",
    title: "Vibrant Echoes",
    artist: "Nuwan Pradeep",
    price: "LKR 18,000",
    date: "2026-08-05",
    status: "Processing",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=500&q=80",
  },
];

// Enrolled Workshops Sample Data
const sampleEnrolledWorkshops = [
  {
    id: "ws-201",
    title: "Digital Sculpting Masterclass",
    instructor: "Amaya Perera",
    date: "2026-09-15",
    time: "10:00 AM",
    price: "LKR 5,000",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&q=80",
  },
];

// Wishlist Sample Data
const sampleWishlist = [
  {
    id: "fav-301",
    title: "Kandyan Horizon",
    artist: "Sahan Jayasinghe",
    price: "LKR 32,000",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80",
  },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "workshops" | "wishlist" | "profile">("orders");

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
              My Profile Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track your purchased art, enrolled workshops, saved items, and personal details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/artworks" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-purple-200"
            >
              <ShoppingBag size={15} />
              Explore Gallery
            </Link>

            <Link 
              href="/workshops" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-purple-200"
            >
              <Video size={15} />
              Browse Workshops
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-8 space-y-8">
        
        {/* Stats Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Purchased Art</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{samplePurchases.length}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">My Workshops</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{sampleEnrolledWorkshops.length}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Wishlist Items</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{sampleWishlist.length}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Spent</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">LKR 48,000</h3>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="border-b border-gray-200 flex items-center gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === "orders"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            My Orders ({samplePurchases.length})
          </button>
          
          <button
            onClick={() => setActiveTab("workshops")}
            className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === "workshops"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Enrolled Workshops ({sampleEnrolledWorkshops.length})
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === "wishlist"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Wishlist ({sampleWishlist.length})
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === "profile"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Personal Details
          </button>
        </div>

        {/* TAB 1: MY ORDERS (PURCHASED ARTWORKS) */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {samplePurchases.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                    item.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status === 'Delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {item.status}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 truncate">{item.title}</h3>
                      <p className="text-xs text-gray-500">By {item.artist}</p>
                    </div>
                    <span className="font-bold text-xs text-purple-600">{item.price}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-500">
                    <span>Date: {item.date}</span>
                    <button className="text-purple-600 hover:underline font-semibold flex items-center gap-1">
                      Receipt <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ENROLLED WORKSHOPS */}
        {activeTab === "workshops" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleEnrolledWorkshops.map((ws) => (
              <div key={ws.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img src={ws.image} alt={ws.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                    {ws.status}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-serif font-bold text-base text-slate-900 truncate">{ws.title}</h3>
                  <p className="text-xs text-gray-500">Host: {ws.instructor}</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p className="flex items-center gap-2"><Calendar size={14} className="text-purple-600" /> {ws.date} at {ws.time}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <span className="font-bold text-purple-600">{ws.price}</span>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md shadow-purple-200">
                      Join Class
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleWishlist.map((fav) => (
              <div key={fav.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img src={fav.image} alt={fav.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 truncate">{fav.title}</h3>
                      <p className="text-xs text-gray-500">By {fav.artist}</p>
                    </div>
                    <span className="font-bold text-xs text-purple-600">{fav.price}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                    <Link 
                      href={`/artworks/${fav.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-purple-200"
                    >
                      <ShoppingBag size={15} />
                      Buy Artwork Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PERSONAL DETAILS */}
        {activeTab === "profile" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl space-y-6">
            <div className="flex items-center gap-5">
              <img src={customerDetails.avatar} alt="Profile Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-purple-500 shadow-md" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">{customerDetails.name}</h2>
                <p className="text-xs text-gray-500">Member since {customerDetails.joinedDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                <p className="text-gray-400 font-semibold flex items-center gap-1.5"><Mail size={14} /> Email Address</p>
                <p className="font-bold text-slate-800">{customerDetails.email}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                <p className="text-gray-400 font-semibold flex items-center gap-1.5"><User size={14} /> Contact Number</p>
                <p className="font-bold text-slate-800">{customerDetails.phone}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-1 sm:col-span-2">
                <p className="text-gray-400 font-semibold flex items-center gap-1.5"><MapPin size={14} /> Shipping Address</p>
                <p className="font-bold text-slate-800">{customerDetails.address}</p>
              </div>
            </div>

            <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md shadow-purple-200">
              Edit Profile Info
            </button>
          </div>
        )}

      </div>
    </div>
  );
}