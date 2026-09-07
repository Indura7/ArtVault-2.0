'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Palette, 
  CheckSquare, 
  LogOut, 
  Eye, 
  Search, 
  DollarSign, 
  Send, 
  Sun, 
  Moon, 
  Download, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  X,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Calendar,
  Trash2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

// ----------------------------------------------------------------------
// 1. SUPABASE CLIENT SETUP
// ----------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminDashboardPage() {
  // Hydration Fix Guard
  const [isMounted, setIsMounted] = useState(false);

  // Auth & UI States
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // App Navigation States
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Modal View States
  const [selectedArtistView, setSelectedArtistView] = useState(null);
  const [selectedArtworkView, setSelectedArtworkView] = useState(null);
  const [selectedModerationItem, setSelectedModerationItem] = useState(null);
  const [isAddWorkshopOpen, setIsAddWorkshopOpen] = useState(false);

  // New Workshop Form State
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    date: '',
    price: '',
    capacity: '',
    status: 'Upcoming'
  });
  
  // Table Interactivity & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedArtists, setSelectedArtists] = useState([]);

  // Database Dynamic Data States
  const [artists, setArtists] = useState([]);
  const [pendingModerations, setPendingModerations] = useState([]);
  const [allArtworks, setAllArtworks] = useState([]);
  const [financialOrders, setFinancialOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: '$0',
    activeArtists: 0,
    artworksSold: 0,
    pendingModerationsCount: 0
  });

  // Mount Guard to Prevent Hydration Error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Database Data on Initial Load & Tab Change
  useEffect(() => {
    if (isAuthenticated && isMounted) {
      fetchDashboardData();
    }
  }, [isAuthenticated, activeTab, isMounted]);

  // ----------------------------------------------------------------------
  // 2. SUPABASE REAL DATABASE FETCHING
  // ----------------------------------------------------------------------
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [
        artistsRes,
        pendingRes,
        ordersRes,
        salesRes,
        allArtworksRes,
        messagesRes,
        workshopsRes
      ] = await Promise.all([
        supabase.from('artist').select(`
          artist_id,
          first_name,
          last_name,
          email,
          date_joined,
          artwork ( count )
        `),
        
        supabase.from('artwork').select(`
          art_id,
          title,
          price,  
          status,
          image_path,
          date_added,
          artist:artist_id ( first_name, last_name, email )
        `).ilike('status', 'pending'),

        supabase.from('orders').select(`
          order_id,
          total_amount,
          status,
          created_at,
          customer:customer_id ( first_name, last_name )
        `),

        supabase.from('sales').select('amount, created_at'),

        supabase.from('artwork').select(`
          art_id,
          title,
          price,
          status,
          image_path,
          date_added,
          artist:artist_id ( first_name, last_name, email )
        `),

        supabase.from('comment').select(`
          comment_id,
          content,
          created_at,
          artist:artist_id ( first_name, last_name )
        `),

        supabase.from('workshop').select('*').order('date', { ascending: true })
      ]);

      // Format Artists
      const formattedArtists = (artistsRes.data || []).map(a => ({
        id: a.artist_id,
        name: `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'Unknown Artist',
        email: a.email || 'N/A',
        artworks: a.artwork?.[0]?.count || 0,
        joinedDate: a.date_joined ? new Date(a.date_joined).toLocaleDateString() : 'N/A',
        sales: '$0',
        status: 'Active'
      }));
      setArtists(formattedArtists);

      // Format Pending Moderations
      const formattedPending = (pendingRes.data || []).map(item => ({
        id: item.art_id,
        title: item.title,
        artist: item.artist ? `${item.artist.first_name || ''} ${item.artist.last_name || ''}` : 'Unknown Artist',
        artistEmail: item.artist?.email || 'N/A',
        price: `$${item.price}`,
        img: item.image_path,
        date: item.date_added ? new Date(item.date_added).toLocaleDateString() : 'Recent'
      }));
      setPendingModerations(formattedPending);

      // Format All Artworks
      const formattedAllArtworks = (allArtworksRes.data || []).map(item => ({
        id: item.art_id,
        title: item.title,
        artist: item.artist ? `${item.artist.first_name || ''} ${item.artist.last_name || ''}` : 'Unknown Artist',
        artistEmail: item.artist?.email || 'N/A',
        price: item.price,
        status: item.status || 'Active',
        img: item.image_path,
        date: item.date_added ? new Date(item.date_added).toLocaleDateString() : 'N/A'
      }));
      setAllArtworks(formattedAllArtworks);

      // Format Orders
      const formattedOrders = (ordersRes.data || []).map(o => ({
        id: o.order_id,
        customer: o.customer ? `${o.customer.first_name || ''} ${o.customer.last_name || ''}` : 'Guest',
        amount: o.total_amount,
        status: o.status || 'Completed',
        date: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'
      }));
      setFinancialOrders(formattedOrders);

      // Format Messages
      const formattedMessages = (messagesRes.data || []).map(m => ({
        id: m.comment_id,
        sender: m.artist ? `${m.artist.first_name || ''} ${m.artist.last_name || ''}` : 'Anonymous Artist',
        content: m.content,
        date: m.created_at ? new Date(m.created_at).toLocaleString() : 'Recent'
      }));
      setMessages(formattedMessages);

      // Format Workshops
      const formattedWorkshops = (workshopsRes.data || []).map(w => ({
        id: w.workshop_id,
        title: w.title || 'Untitled Workshop',
        description: w.description || '',
        date: w.date ? new Date(w.date).toLocaleDateString() : 'TBD',
        price: w.price || 0,
        capacity: w.capacity || 0,
        status: w.status || 'Upcoming'
      }));
      setWorkshops(formattedWorkshops);

      // Calculate Stats
      const totalRev = (ordersRes.data || []).reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
      setStats({
        totalRevenue: `$${totalRev.toLocaleString()}`,
        activeArtists: formattedArtists.length,
        artworksSold: ordersRes.data ? ordersRes.data.length : 0,
        pendingModerationsCount: formattedPending.length
      });

      // Chart Data Aggregation
      const combinedTransactionData = [
        ...(salesRes.data || []).map(s => ({ amount: Number(s.amount || 0), created_at: s.created_at })),
        ...(ordersRes.data || []).map(o => ({ amount: Number(o.total_amount || 0), created_at: o.created_at }))
      ];

      if (combinedTransactionData.length > 0) {
        const monthlyAggregation = {};
        combinedTransactionData.forEach(tx => {
          if (tx.created_at) {
            const txDate = new Date(tx.created_at);
            if (!isNaN(txDate.getTime())) {
              const monthYearKey = txDate.toLocaleString('en-US', { month: 'short' });
              monthlyAggregation[monthYearKey] = (monthlyAggregation[monthYearKey] || 0) + tx.amount;
            }
          }
        });

        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedGraphData = Object.keys(monthlyAggregation)
          .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
          .map(month => ({ month, revenue: monthlyAggregation[month] }));

        setChartData(formattedGraphData);
      } else {
        setChartData([]);
      }

    } catch (error) {
      console.error('Error fetching database data:', error);
      showToast('Database එකෙන් data ලබා ගැනීමට අපොහොසත් විය', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 3. WORKSHOP CRUD ACTIONS
  // ----------------------------------------------------------------------
  const handleCreateWorkshop = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('workshop').insert([
        {
          title: newWorkshop.title,
          description: newWorkshop.description,
          date: newWorkshop.date,
          price: parseFloat(newWorkshop.price || 0),
          capacity: parseInt(newWorkshop.capacity || 0),
          status: newWorkshop.status
        }
      ]);

      if (error) throw error;

      showToast('Workshop එක සාර්ථකව එකතු කරන ලදී!');
      setIsAddWorkshopOpen(false);
      setNewWorkshop({ title: '', description: '', date: '', price: '', capacity: '', status: 'Upcoming' });
      fetchDashboardData();
    } catch (err) {
      console.error('Error creating workshop:', err);
      showToast(`Workshop සෑදීම අසාර්ථක විය: ${err.message}`, 'error');
    }
  };

  const handleDeleteWorkshop = async (id) => {
    if (!confirm('ඔබට විශ්වාසද මෙම Workshop එක ඉවත් කිරීමට?')) return;
    try {
      const { error } = await supabase.from('workshop').delete().eq('workshop_id', id);
      if (error) throw error;

      showToast('Workshop එක ඉවත් කරන ලදී!');
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting workshop:', err);
      showToast(`ඉවත් කිරීමට නොහැකි විය: ${err.message}`, 'error');
    }
  };

  // Moderation Handlers
  const handleApprove = async (id, title) => {
    try {
      const { error } = await supabase.from('artwork').update({ status: 'Approved' }).eq('art_id', id);
      if (error) throw error;

      setPendingModerations(prev => prev.filter(item => item.id !== id));
      setSelectedModerationItem(null);
      showToast(`Approved "${title}" successfully!`);
      fetchDashboardData();
    } catch (err) {
      showToast(`Approval failed: ${err.message}`, 'error');
    }
  };

  const handleReject = async (id, title) => {
    try {
      const { error } = await supabase.from('artwork').update({ status: 'Rejected' }).eq('art_id', id);
      if (error) throw error;

      setPendingModerations(prev => prev.filter(item => item.id !== id));
      setSelectedModerationItem(null);
      showToast(`Rejected "${title}"`, 'error');
      fetchDashboardData();
    } catch (err) {
      showToast(`Rejection failed: ${err.message}`, 'error');
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      showToast('Export කිරීමට Data නොමැත', 'error');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    showToast('Exported data successfully!');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Manage Artist', icon: Users },
    { name: 'Manage Artworks', icon: Palette },
    { name: 'Manage Workshops', icon: Calendar },
    { name: 'Artwork Moderation', icon: CheckSquare },
    { name: 'Financial & Payouts', icon: DollarSign },
    { name: 'Broadcast & Messages', icon: Send },
    { name: 'Settings', icon: Settings },
  ];

  const filteredWorkshops = workshops.filter(w =>
    w.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArtists = artists.filter(a =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArtworks = allArtworks.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.artist?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hydration safety check
  if (!isMounted) return null;

  // 1. LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl mx-auto shadow-lg">
              AV
            </div>
            <h2 className="text-2xl font-bold text-white">ArtVault Admin Portal</h2>
            <p className="text-xs text-slate-400">Sign in with administrative privileges</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); showToast('Logged in successfully!'); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" defaultValue="admin@artvault.com" required className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="password" defaultValue="••••••••" required className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-all">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD VIEW
  return (
    <div className={`flex h-screen font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
          toast.type === 'error' ? 'bg-red-500 text-white border-red-600' : 'bg-slate-900 text-white border-slate-800'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-300" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`w-64 flex flex-col justify-between p-4 shrink-0 transition-colors border-r ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
        <div>
          <div className="flex items-center justify-between px-3 py-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
                AV
              </div>
              <span className="font-bold text-base text-white tracking-wide">ArtVault</span>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => { setActiveTab(item.name); setSearchTerm(''); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-3">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className={`h-24 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>)}
            </div>
            <div className={`h-80 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          </div>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {activeTab === 'Dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', val: stats.totalRevenue, change: '+18%' },
                    { label: 'Active Artists', val: stats.activeArtists, change: '+12%' },
                    { label: 'Artworks Sold', val: stats.artworksSold, change: '+8%' },
                    { label: 'Pending Moderations', val: stats.pendingModerationsCount, change: '-3' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-5 rounded-xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.val}</h3>
                      <span className="text-xs font-medium text-emerald-500 mt-2 inline-block">{stat.change} vs last month</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`lg:col-span-2 p-6 rounded-xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Real-Time Revenue Analytics</h3>
                      <span className="text-xs bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-full font-semibold">
                        Auto-Updated from DB
                      </span>
                    </div>

                    <div className="h-64 w-full">
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(val) => `$${val}`} />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                          No sales or order data recorded in database yet.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-semibold">Quick Moderation Queue</h3>
                    {pendingModerations.length === 0 ? (
                      <p className="text-sm text-slate-400">No pending items for moderation.</p>
                    ) : (
                      pendingModerations.slice(0, 3).map((item) => (
                        <div key={item.id} className={`p-3 rounded-lg border flex items-center justify-between ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center gap-3">
                            <img src={item.img || 'https://via.placeholder.com/150'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <p className="font-semibold text-sm">{item.title}</p>
                              <p className="text-xs text-slate-400">by {item.artist}</p>
                            </div>
                          </div>
                          <button onClick={() => setSelectedModerationItem(item)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MANAGE WORKSHOPS TAB */}
            {activeTab === 'Manage Workshops' && (
              <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">Art Workshops Management</h2>
                    <p className="text-xs text-slate-400">Directly syncs with Database table `workshop`</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search workshops..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>

                    <button onClick={() => exportToCSV(filteredWorkshops, 'workshops_list')} className="border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 border-slate-700">
                      <Download className="w-4 h-4" /> CSV
                    </button>
                    <button onClick={() => setIsAddWorkshopOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Workshop
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {filteredWorkshops.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-slate-400">
                      Database එකෙහි Workshops සොයා ගැනීමට නැත.
                    </div>
                  ) : (
                    filteredWorkshops.map((ws) => (
                      <div key={ws.id} className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-base line-clamp-1">{ws.title}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              ws.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-500' :
                              ws.status === 'Live' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                            }`}>
                              {ws.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{ws.description || 'No description provided.'}</p>
                          
                          <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Date:</span>
                              <span className="font-semibold">{ws.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Price:</span>
                              <span className="font-semibold text-indigo-400">${ws.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Capacity:</span>
                              <span className="font-semibold">{ws.capacity} Seats</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-700/30 flex justify-end">
                          <button 
                            onClick={() => handleDeleteWorkshop(ws.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Workshop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ARTISTS TAB */}
            {activeTab === 'Manage Artist' && (
              <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className="text-lg font-bold">Registered Artists Directory</h2>
                <table className="w-full text-left border-collapse mt-4">
                  <thead>
                    <tr className={`border-b text-xs uppercase ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'}`}>
                      <th className="py-3 px-4">Artist Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Artworks</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {filteredArtists.map((a) => (
                      <tr key={a.id}>
                        <td className="py-3 px-4 font-semibold">{a.name}</td>
                        <td className="py-3 px-4 text-slate-400">{a.email}</td>
                        <td className="py-3 px-4">{a.artworks}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-500">{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ARTWORKS TAB */}
            {activeTab === 'Manage Artworks' && (
              <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className="text-lg font-bold">All Artworks Repository</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {filteredArtworks.map((art) => (
                    <div key={art.id} className="p-4 rounded-xl border border-slate-700">
                      <img src={art.img || 'https://via.placeholder.com/300'} alt="" className="w-full h-40 object-cover rounded-lg mb-2" />
                      <h4 className="font-bold text-sm">{art.title}</h4>
                      <p className="text-xs text-slate-400">${art.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ADD WORKSHOP MODAL */}
      {isAddWorkshopOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl ${darkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base">Add New Workshop</h3>
              <button onClick={() => setIsAddWorkshopOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateWorkshop} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Title</label>
                <input 
                  type="text" 
                  required 
                  value={newWorkshop.title} 
                  onChange={(e) => setNewWorkshop({...newWorkshop, title: e.target.value})}
                  className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                <textarea 
                  rows="2"
                  value={newWorkshop.description} 
                  onChange={(e) => setNewWorkshop({...newWorkshop, description: e.target.value})}
                  className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newWorkshop.date} 
                    onChange={(e) => setNewWorkshop({...newWorkshop, date: e.target.value})}
                    className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={newWorkshop.price} 
                    onChange={(e) => setNewWorkshop({...newWorkshop, price: e.target.value})}
                    className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Capacity</label>
                  <input 
                    type="number" 
                    required 
                    value={newWorkshop.capacity} 
                    onChange={(e) => setNewWorkshop({...newWorkshop, capacity: e.target.value})}
                    className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Status</label>
                  <select 
                    value={newWorkshop.status} 
                    onChange={(e) => setNewWorkshop({...newWorkshop, status: e.target.value})}
                    className={`w-full p-2 text-sm rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-semibold text-sm">
                  Save Workshop
                </button>
                <button type="button" onClick={() => setIsAddWorkshopOpen(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}