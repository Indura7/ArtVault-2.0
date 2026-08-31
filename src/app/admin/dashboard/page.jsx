'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Palette, 
  CheckSquare, 
  UserCheck, 
  BarChart3, 
  Calendar, 
  History,
  LogOut,
  Check,
  X,
  Plus,
  Sliders,
  Eye,
  Search,
  DollarSign,
  Send,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sun,
  Moon,
  Download,
  Lock,
  Mail,
  ShieldAlert,
  CheckCircle2,
  AlertCircle
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

export default function AdminPage() {
  // Auth & UI States
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Toggle to false to test Login
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // App Navigation States
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [quickModModal, setQuickModModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  
  // Table Interactivity States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedArtists, setSelectedArtists] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Mock Loading Effect on Tab Change
  const handleTabChange = (tab) => {
    setIsLoading(true);
    setActiveTab(tab);
    setTimeout(() => setIsLoading(false), 400);
  };

  // CSV Export Logic
  const exportToCSV = (data, filename) => {
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

  // Dataset
  const artists = [
    { id: 1, name: 'Elena Rostova', email: 'elena@art.com', artworks: 24, sales: '$12400', status: 'Active' },
    { id: 2, name: 'Marcus Chen', email: 'marcus@art.com', artworks: 18, sales: '$8900', status: 'Active' },
    { id: 3, name: 'Sarah Jenkins', email: 'sarah@art.com', artworks: 42, sales: '$24100', status: 'Pending' },
    { id: 4, name: 'Amara Patel', email: 'amara@art.com', artworks: 11, sales: '$4200', status: 'Active' },
    { id: 5, name: 'Liam Vance', email: 'liam@art.com', artworks: 5, sales: '$1100', status: 'Suspended' },
  ];

  const pendingModerations = [
    { id: 101, title: 'Neon Dreams #42', artist: 'Elena Rostova', price: '$1,200', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80' },
    { id: 102, title: 'Vortex of Color', artist: 'Alex Rivers', price: '$650', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80' },
    { id: 103, title: 'Golden Horizons', artist: 'Maya Lin', price: '$1,800', img: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80' },
  ];

  const chartData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 30000 },
    { month: 'Jun', revenue: 28000 },
  ];

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Manage Artist', icon: Users },
    { name: 'Manage Artworks', icon: Palette },
    { name: 'Artwork Moderation', icon: CheckSquare },
    { name: 'Financial & Payouts', icon: DollarSign },
    { name: 'Broadcast & Messages', icon: Send },
    { name: 'Settings', icon: Settings },
  ];

  // Checkbox Selection
  const toggleSelectAll = () => {
    if (selectedArtists.length === artists.length) setSelectedArtists([]);
    else setSelectedArtists(artists.map(a => a.id));
  };

  const toggleSelectArtist = (id) => {
    if (selectedArtists.includes(id)) setSelectedArtists(selectedArtists.filter(i => i !== id));
    else setSelectedArtists([...selectedArtists, id]);
  };

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
      
      {/* TOAST NOTIFICATION CONTAINER */}
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
            {/* Dark Mode Toggle */}
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
                  onClick={() => handleTabChange(item.name)}
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
          /* LOADING SKELETON UI */
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
                    { label: 'Total Revenue', val: '$124,500', change: '+18%' },
                    { label: 'Active Artists', val: '1,420', change: '+12%' },
                    { label: 'Artworks Sold', val: '8,540', change: '+8%' },
                    { label: 'Pending Moderations', val: '14', change: '-3' },
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
                    <h3 className="font-semibold mb-4">Revenue Growth (2026)</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip />
                          <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-semibold">Quick Moderation Queue</h3>
                    {pendingModerations.slice(0, 2).map((item) => (
                      <div key={item.id} className={`p-3 rounded-lg border flex items-center justify-between ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <img src={item.img} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold text-sm">{item.title}</p>
                            <p className="text-xs text-slate-400">by {item.artist}</p>
                          </div>
                        </div>
                        <button onClick={() => { setSelectedArtwork(item); setQuickModModal(true); }} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MANAGE ARTISTS (With Checkboxes & CSV Export) */}
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
                    <button onClick={() => exportToCSV(artists, 'artists_directory')} className="border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700">
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
                        <input type="checkbox" checked={selectedArtists.length === artists.length} onChange={toggleSelectAll} className="rounded accent-indigo-600" />
                      </th>
                      <th className="py-3 px-4">Artist Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Artworks</th>
                      <th className="py-3 px-4">Sales</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {artists.map((a) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ARTWORK MODERATION QUEUE */}
            {activeTab === 'Artwork Moderation' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Pending Artwork Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pendingModerations.map((item) => (
                    <div key={item.id} className={`rounded-xl border shadow-sm overflow-hidden flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div>
                        <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="font-bold">{item.title}</h3>
                          <p className="text-sm text-slate-400">Artist: {item.artist}</p>
                          <p className="text-indigo-500 font-bold mt-2">{item.price}</p>
                        </div>
                      </div>

                      <div className="p-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                        <button onClick={() => showToast(`Approved "${item.title}"`)} className="bg-emerald-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700">
                          Approve
                        </button>
                        <button onClick={() => showToast(`Rejected "${item.title}"`, 'error')} className="bg-red-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-red-700">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OTHER TABS PLACEHOLDER */}
            {!['Dashboard', 'Manage Artist', 'Artwork Moderation'].includes(activeTab) && (
              <div className={`rounded-xl border p-12 text-center space-y-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Sliders className="w-12 h-12 mx-auto text-indigo-500" />
                <h3 className="text-lg font-bold">{activeTab} Interface</h3>
                <p className="text-sm text-slate-400">Controls and views for {activeTab.toLowerCase()} management.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* QUICK MODERATION MODAL */}
      {quickModModal && selectedArtwork && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4 ${darkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold">Review Artwork: {selectedArtwork.title}</h3>
              <button onClick={() => setQuickModModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedArtwork.img} alt="" className="w-full h-56 object-cover rounded-lg" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setQuickModModal(false); showToast('Approved artwork!'); }} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold text-sm">
                Approve & Publish
              </button>
              <button onClick={() => { setQuickModModal(false); showToast('Artwork rejected', 'error'); }} className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg font-semibold text-sm">
                Reject Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}