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
  UserCheck
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
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: '$0',
    activeArtists: 0,
    artworksSold: 0,
    pendingModerationsCount: 0
  });

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Database Data on Initial Load & Tab Change
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  // ----------------------------------------------------------------------
  // 2. SUPABASE REAL DATABASE FETCHING & DYNAMIC GRAPH LOGIC
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
        messagesRes
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
        `)
      ]);

      // 1. Format Artists List
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

      // 2. Format Pending Moderations List
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

      // 3. Format All Artworks List
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

      // 4. Format Financial Orders
      const formattedOrders = (ordersRes.data || []).map(o => ({
        id: o.order_id,
        customer: o.customer ? `${o.customer.first_name || ''} ${o.customer.last_name || ''}` : 'Guest',
        amount: o.total_amount,
        status: o.status || 'Completed',
        date: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'
      }));
      setFinancialOrders(formattedOrders);

      // 5. Format Messages / Comments
      const formattedMessages = (messagesRes.data || []).map(m => ({
        id: m.comment_id,
        sender: m.artist ? `${m.artist.first_name || ''} ${m.artist.last_name || ''}` : 'Anonymous Artist',
        content: m.content,
        date: m.created_at ? new Date(m.created_at).toLocaleString() : 'Recent'
      }));
      setMessages(formattedMessages);

      // 6. Calculate Overall Stats
      const totalRev = (ordersRes.data || []).reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
      const totalSold = ordersRes.data ? ordersRes.data.length : 0;

      setStats({
        totalRevenue: `$${totalRev.toLocaleString()}`,
        activeArtists: formattedArtists.length,
        artworksSold: totalSold,
        pendingModerationsCount: formattedPending.length
      });

      // ------------------------------------------------------------------
      // DYNAMIC GRAPH DATA GENERATION FROM SALES & ORDERS TABLE
      // ------------------------------------------------------------------
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
          .map(month => ({
            month: month,
            revenue: monthlyAggregation[month]
          }));

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
  // 3. DATABASE MODERATION UPDATES
  // ----------------------------------------------------------------------
  const handleApprove = async (id, title) => {
    try {
      const { error } = await supabase
        .from('artwork')
        .update({ status: 'Approved' })
        .eq('art_id', id);

      if (error) throw error;

      setPendingModerations(prev => prev.filter(item => item.id !== id));
      setSelectedModerationItem(null);
      showToast(`Approved "${title}" successfully!`);
      fetchDashboardData();
    } catch (err) {
      console.error('Approve Error:', err);
      showToast(`Approval failed: ${err.message}`, 'error');
    }
  };

  const handleReject = async (id, title) => {
    try {
      const { error } = await supabase
        .from('artwork')
        .update({ status: 'Rejected' })
        .eq('art_id', id);

      if (error) throw error;

      setPendingModerations(prev => prev.filter(item => item.id !== id));
      setSelectedModerationItem(null);
      showToast(`Rejected "${title}"`, 'error');
      fetchDashboardData();
    } catch (err) {
      console.error('Reject Error:', err);
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
    showToast('Exported data successfully to CSV!');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Manage Artist', icon: Users },
    { name: 'Manage Artworks', icon: Palette },
    { name: 'Artwork Moderation', icon: CheckSquare },
    { name: 'Financial & Payouts', icon: DollarSign },
    { name: 'Broadcast & Messages', icon: Send },
    { name: 'Settings', icon: Settings },
  ];

  const toggleSelectAll = () => {
    if (selectedArtists.length === artists.length) setSelectedArtists([]);
    else setSelectedArtists(artists.map(a => a.id));
  };

  const toggleSelectArtist = (id) => {
    if (selectedArtists.includes(id)) setSelectedArtists(selectedArtists.filter(i => i !== id));
    else setSelectedArtists([...selectedArtists, id]);
  };

  const filteredArtists = artists.filter(a => {
    const matchesSearch = a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredArtworks = allArtworks.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.artist?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. ADMIN LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl mx-auto shadow-lg shadow-indigo-600/30">
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
                <input type="email" defaultValue="admin@artvault.com" required className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="password" defaultValue="••••••••" required className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm shadow-lg shadow-indigo-600/30 transition-all">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN DASHBOARD VIEW
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
            {/* 1. DASHBOARD TAB */}
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
                  {/* REAL-TIME AUTO UPDATING GRAPH FROM DATABASE */}
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

            {/* 2. MANAGE ARTISTS TAB */}
            {activeTab === 'Manage Artist' && (
              <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">Registered Artists Directory</h2>
                    {selectedArtists.length > 0 && (
                      <p className="text-xs text-indigo-500 font-semibold mt-1">{selectedArtists.length} artists selected for bulk action</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search artists..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>

                    <button onClick={() => exportToCSV(filteredArtists, 'artists_directory')} className="border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700">
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={() => showToast('Artist form opened!')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Artist
                    </button>
                  </div>
                </div>

                <table className="w-full text-left border-collapse mt-4">
                  <thead>
                    <tr className={`border-b text-xs uppercase ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'}`}>
                      <th className="py-3 px-2">
                        <input type="checkbox" checked={selectedArtists.length === filteredArtists.length && filteredArtists.length > 0} onChange={toggleSelectAll} className="rounded accent-indigo-600" />
                      </th>
                      <th className="py-3 px-4">Artist Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Artworks</th>
                      <th className="py-3 px-4">Sales</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {filteredArtists.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400">No artists found in database.</td>
                      </tr>
                    ) : (
                      filteredArtists.map((a) => (
                        <tr key={a.id} className={darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                          <td className="py-3 px-2">
                            <input type="checkbox" checked={selectedArtists.includes(a.id)} onChange={() => toggleSelectArtist(a.id)} className="rounded accent-indigo-600" />
                          </td>
                          <td className="py-3 px-4 font-semibold">{a.name}</td>
                          <td className="py-3 px-4 text-slate-400">{a.email}</td>
                          <td className="py-3 px-4">{a.artworks}</td>
                          <td className="py-3 px-4 font-medium">{a.sales}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              a.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button 
                              onClick={() => setSelectedArtistView(a)}
                              className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg dark:bg-slate-800 dark:text-indigo-400"
                              title="View Artist Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. MANAGE ARTWORKS TAB */}
            {activeTab === 'Manage Artworks' && (
              <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold">All Artworks Repository</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search artworks..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>
                    <button onClick={() => exportToCSV(filteredArtworks, 'all_artworks')} className="border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 border-slate-700">
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {filteredArtworks.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-slate-400">No artworks found in database.</div>
                  ) : (
                    filteredArtworks.map((art) => (
                      <div key={art.id} className={`p-4 rounded-xl border flex flex-col justify-between ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div>
                          <img src={art.img || 'https://via.placeholder.com/300'} alt={art.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                          <h4 className="font-bold text-sm truncate">{art.title}</h4>
                          <p className="text-xs text-slate-400">By {art.artist}</p>
                        </div>
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-700/30">
                          <span className="font-bold text-indigo-500 text-sm">${art.price}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              art.status?.toLowerCase() === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>{art.status}</span>
                            <button 
                              onClick={() => setSelectedArtworkView(art)} 
                              className="p-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-400"
                              title="View Artwork Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 4. ARTWORK MODERATION TAB */}
            {activeTab === 'Artwork Moderation' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Pending Artwork Reviews</h2>
                {pendingModerations.length === 0 ? (
                  <div className={`p-8 text-center rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                    No artworks currently waiting for moderation.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pendingModerations.map((item) => (
                      <div key={item.id} className={`rounded-xl border shadow-sm overflow-hidden flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div>
                          <img src={item.img || 'https://via.placeholder.com/400'} alt={item.title} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-sm text-slate-400">Artist: {item.artist}</p>
                            <p className="text-indigo-500 font-bold mt-2">{item.price}</p>
                          </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <button 
                            onClick={() => setSelectedModerationItem(item)}
                            className="w-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-indigo-100"
                          >
                            <Eye className="w-4 h-4" /> View Full Details
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleApprove(item.id, item.title)} className="bg-emerald-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700">
                              Approve
                            </button>
                            <button onClick={() => handleReject(item.id, item.title)} className="bg-red-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-red-700">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. FINANCIAL & PAYOUTS TAB */}
            {activeTab === 'Financial & Payouts' && (
              <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Financial Orders & Transactions</h2>
                  <button onClick={() => exportToCSV(financialOrders, 'financial_transactions')} className="border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 border-slate-700">
                    <Download className="w-4 h-4" /> Export Report
                  </button>
                </div>

                <table className="w-full text-left border-collapse mt-4">
                  <thead>
                    <tr className={`border-b text-xs uppercase ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'}`}>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {financialOrders.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-slate-400">No financial transactions found.</td>
                      </tr>
                    ) : (
                      financialOrders.map((order) => (
                        <tr key={order.id} className={darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                          <td className="py-3 px-4 font-semibold">#{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 font-bold text-indigo-500">${order.amount}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 6. BROADCAST & MESSAGES TAB */}
            {activeTab === 'Broadcast & Messages' && (
              <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className="text-lg font-bold">Artist Comments & Feedbacks</h2>
                <div className="space-y-3 mt-4">
                  {messages.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">No messages or comments found.</div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-lg border flex gap-3 ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <MessageSquare className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-indigo-400 font-semibold">{msg.sender}</p>
                          <p className="text-sm mt-1">{msg.content}</p>
                          <span className="text-[10px] text-slate-500 mt-2 block">{msg.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {activeTab === 'Settings' && (
              <div className={`p-6 rounded-xl border shadow-sm max-w-xl space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-500" />
                  <h2 className="text-lg font-bold">Admin System Settings</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Admin Primary Email</label>
                    <input type="email" defaultValue="admin@artvault.com" className={`w-full p-2.5 text-sm rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Update Password</label>
                    <input type="password" placeholder="Enter new password" className={`w-full p-2.5 text-sm rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`} />
                  </div>
                  <button onClick={() => showToast('Settings saved successfully!')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-sm font-semibold rounded-lg shadow-md transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* VIEW ARTIST DETAILS MODAL */}
      {selectedArtistView && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl ${darkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base">Artist Details</h3>
              </div>
              <button onClick={() => setSelectedArtistView(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Full Name</span>
                <p className="font-semibold">{selectedArtistView.name}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Email Address</span>
                <p className="font-semibold text-indigo-500">{selectedArtistView.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block">Total Artworks</span>
                  <p className="font-bold text-lg">{selectedArtistView.artworks}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Joined Date</span>
                  <p className="font-semibold">{selectedArtistView.joinedDate}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedArtistView(null)} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-medium text-sm mt-4">
              Close
            </button>
          </div>
        </div>
      )}

      {/* VIEW ARTWORK DETAILS MODAL */}
      {selectedArtworkView && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl ${darkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base">Artwork Information</h3>
              <button onClick={() => setSelectedArtworkView(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <img src={selectedArtworkView.img || 'https://via.placeholder.com/400'} alt="" className="w-full h-48 object-cover rounded-xl" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-base">{selectedArtworkView.title}</h4>
                <span className="font-bold text-indigo-500 text-lg">${selectedArtworkView.price}</span>
              </div>
              <p className="text-xs text-slate-400">Created By: <span className="text-slate-200 font-semibold">{selectedArtworkView.artist}</span></p>
              <p className="text-xs text-slate-400">Artist Email: <span className="text-slate-200">{selectedArtworkView.artistEmail}</span></p>
              <p className="text-xs text-slate-400">Added Date: <span className="text-slate-200">{selectedArtworkView.date}</span></p>
            </div>

            <button onClick={() => setSelectedArtworkView(null)} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-medium text-sm mt-2">
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODERATION VIEW & ACTION MODAL */}
      {selectedModerationItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4 ${darkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold">Review Artwork Moderation</h3>
              <button onClick={() => setSelectedModerationItem(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedModerationItem.img || 'https://via.placeholder.com/400'} alt="" className="w-full h-56 object-cover rounded-lg" />
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg">{selectedModerationItem.title}</h4>
                <span className="text-indigo-500 font-bold text-lg">{selectedModerationItem.price}</span>
              </div>
              <p className="text-xs text-slate-400">Artist: <span className="text-slate-200 font-semibold">{selectedModerationItem.artist}</span> ({selectedModerationItem.artistEmail})</p>
              <p className="text-xs text-slate-400">Submitted Date: {selectedModerationItem.date}</p>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => handleApprove(selectedModerationItem.id, selectedModerationItem.title)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-semibold text-sm">
                Approve & Publish
              </button>
              <button onClick={() => handleReject(selectedModerationItem.id, selectedModerationItem.title)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-semibold text-sm">
                Reject Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}