"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  Package,
  Trash2,
  Loader2
} from "lucide-react";

export default function CustomerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "workshops" | "wishlist" | "profile">("orders");
  const [loading, setLoading] = useState(true);

  // Dynamic Data States
  const [customer, setCustomer] = useState<any>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]);

  // Fetch logged-in customer's details, orders, and wishlist items on load
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);

      // 1. Get Logged-in Auth User
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      // 2. Fetch Customer Details from public.customer safely
      let { data: customerData } = await supabase
        .from("customer")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      // Fallback by email if auth_id was not yet linked
      if (!customerData && user.email) {
        const { data: byEmail } = await supabase
          .from("customer")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();
        if (byEmail) {
          customerData = byEmail;
          await supabase.from("customer").update({ auth_id: user.id }).eq("customer_id", byEmail.customer_id);
        }
      }

      // If still no customer record, create one
      if (!customerData) {
        const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer";
        const parts = fullName.split(" ");
        const first_name = parts[0] || "Customer";
        const last_name = parts.slice(1).join(" ") || "";
        const { data: newCust } = await supabase
          .from("customer")
          .insert({
            auth_id: user.id,
            email: user.email,
            first_name,
            last_name,
          })
          .select("*")
          .maybeSingle();

        if (newCust) customerData = newCust;
      }

      if (customerData) {
        setCustomer(customerData);

        // 3. Fetch Wishlist Joined with Artwork & Artist Details
        const { data: wishlistData, error: wishError } = await supabase
          .from("wish_list")
          .select(`
            id,
            artowrk_id,
            artwork (
              art_id,
              title,
              price,
              image_path,
              artist (
                first_name,
                last_name
              )
            )
          `)
          .eq("customer_id", customerData.customer_id);

        if (!wishError && wishlistData) {
          setWishlist(wishlistData);
        }

        // 4. Fetch Customer Orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            order_id,
            order_date,
            total_amount,
            status,
            buyer_name,
            phone,
            address,
            city,
            postal_code,
            artwork:artwork!fk_artwork_link (
              art_id,
              title,
              image_path,
              price
            )
          `)
          .eq("customer_id", customerData.customer_id);

        if (!ordersError && ordersData) {
          setOrders(ordersData);
        }
      }

      setLoading(false);
    }

    loadDashboardData();
  }, [router]);

  // Remove item from Wishlist directly inside Dashboard
  const handleRemoveFromWishlist = async (wishlistEntryId: number) => {
    const { error } = await supabase
      .from("wish_list")
      .delete()
      .eq("id", wishlistEntryId);

    if (!error) {
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistEntryId));
    } else {
      console.error("Error removing item:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-purple-600 mb-2" />
        <p className="text-xs text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

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
              Welcome back, {customer?.first_name || customer?.name || "Customer"}
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
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{orders.length}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">My Workshops</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{workshops.length}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Wishlist Items</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{wishlist.length}</h3>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Spent</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                {orders.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} LKR
              </h3>
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
            My Orders ({orders.length})
          </button>
          
          <button
            onClick={() => setActiveTab("workshops")}
            className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === "workshops"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Enrolled Workshops ({workshops.length})
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === "wishlist"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Wishlist ({wishlist.length})
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

        {/* TAB 1: MY ORDERS */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
                <p className="text-sm text-gray-500">No artwork purchases found.</p>
              </div>
            ) : (
              orders.map((order) => {
                const art = order.artwork;
                return (
                  <div key={order.order_id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <img 
                        src={art?.image_path || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119"} 
                        alt={art?.title || "Artwork"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                      {order.status && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider bg-purple-600">
                          {order.status}
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-serif font-bold text-base text-slate-900 truncate">{art?.title || "Artwork Order"}</h3>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">
                          {order.order_date ? new Date(order.order_date).toLocaleDateString() : ""}
                        </span>
                        <span className="font-bold text-purple-600">
                          {Number(order.total_amount || 0).toLocaleString()} LKR
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: ENROLLED WORKSHOPS */}
        {activeTab === "workshops" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
                <p className="text-sm text-gray-500">You haven't enrolled in any workshops yet.</p>
              </div>
            ) : (
              workshops.map((ws) => (
                <div key={ws.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-base text-slate-900">{ws.title}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: DYNAMIC WISHLIST (FROM SUPABASE) */}
        {activeTab === "wishlist" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
                <p className="text-sm text-gray-500">Your wishlist is currently empty.</p>
                <Link href="/artworks" className="mt-3 inline-block text-xs font-bold text-purple-600 hover:underline">
                  Browse Gallery to Add Artworks
                </Link>
              </div>
            ) : (
              wishlist.map((item) => {
                const art = item.artwork;
                return (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group relative">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      title="Remove from Wishlist"
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-600 rounded-full transition shadow-md"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <img 
                        src={art?.image_path || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119"} 
                        alt={art?.title || "Artwork"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif font-bold text-base text-slate-900 truncate">{art?.title}</h3>
                          <p className="text-xs text-gray-500">
                            By {art?.artist?.first_name} {art?.artist?.last_name}
                          </p>
                        </div>
                        <span className="font-bold text-xs text-purple-600">
                          {art?.price ? `${Number(art.price).toLocaleString()} LKR` : "N/A"}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-gray-50">
                        <Link 
                          href={`/artworks/${art?.art_id}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-purple-200"
                        >
                          <ShoppingBag size={15} />
                          Buy Artwork Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 4: PERSONAL DETAILS */}
        {activeTab === "profile" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-purple-100 border-2 border-purple-500 text-purple-700 flex items-center justify-center text-xl font-bold">
                {customer?.first_name ? customer.first_name[0] : "C"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {customer?.first_name} {customer?.last_name}
                </h2>
                <p className="text-xs text-gray-500">Registered Customer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                <p className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <Mail size={14} /> Email Address
                </p>
                <p className="font-bold text-slate-800">{customer?.email || "N/A"}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                <p className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <User size={14} /> Contact Number
                </p>
                <p className="font-bold text-slate-800">{customer?.mobile_no || customer?.phone || "N/A"}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-1 sm:col-span-2">
                <p className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <MapPin size={14} /> Shipping Address
                </p>
                <p className="font-bold text-slate-800">{customer?.address || "N/A"}</p>
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