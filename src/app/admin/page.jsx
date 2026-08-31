'use client';

import React, { useState } from 'react';
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
  Bell,
  Search,
  Check,
  X,
  Plus,
  Sliders,
  Eye
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [quickModModal, setQuickModModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Sample Data
  const artists = [
    { id: 1, name: 'Elena Rostova', email: 'elena@art.com', artworks: 24, sales: '$12,400', status: 'Active' },
    { id: 2, name: 'Marcus Chen', email: 'marcus@art.com', artworks: 18, sales: '$8,900', status: 'Active' },
    { id: 3, name: 'Sarah Jenkins', email: 'sarah@art.com', artworks: 42, sales: '$24,100', status: 'Pending' },
  ];

  const pendingModerations = [
    { id: 101, title: 'Neon Dreams #42', artist: 'Elena Rostova', price: '$1,200', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80' },
    { id: 102, title: 'Vortex of Color', artist: 'Alex Rivers', price: '$650', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80' },
    { id: 103, title: 'Golden Horizons', artist: 'Maya Lin', price: '$1,800', img: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80' },
  ];

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Settings', icon: Settings },
    { name: 'Manage Artist', icon: Users },
    { name: 'Manage Artworks', icon: Palette },
    { name: 'Artwork Moderation', icon: CheckSquare },
    { name: 'Manage Customer', icon: UserCheck },
    { name: 'Reports & Analytics', icon: BarChart3 },
    { name: 'Manage Workshops', icon: Calendar },
    { name: 'Activity Logs', icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-800">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
              AV
            </div>
            <span className="font-bold text-lg text-white tracking-wide">ArtVault Admin</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-3">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-sm font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-slate-800">{activeTab}</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
            <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                alt="Admin Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-600/20"
              />
              <span className="text-sm font-medium text-slate-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Screen Renderer */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* DASHBOARD */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Artists', val: '1,420', change: '+12%' },
                  { label: 'Active Artworks', val: '8,540', change: '+8%' },
                  { label: 'Pending Moderations', val: '14', change: '-3' },
                  { label: 'Total Sales', val: '$124,500', change: '+15%' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.val}</h3>
                    <span className="text-xs font-medium text-emerald-600 mt-2 inline-block">{stat.change} vs last month</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <h3 className="font-semibold text-slate-800 mb-4">Sales Analytics Overview</h3>
                  <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                    [ Analytics Chart View ]
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-semibold text-slate-800">Quick Moderation Queue</h3>
                  {pendingModerations.slice(0, 2).map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.img} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-xs text-slate-500">by {item.artist}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setSelectedArtwork(item); setQuickModModal(true); }}
                        className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MANAGE ARTIST */}
          {activeTab === 'Manage Artist' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Registered Artists</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Artist
                </button>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="py-3 px-4">Artist Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Artworks</th>
                    <th className="py-3 px-4">Total Sales</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {artists.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold">{a.name}</td>
                      <td className="py-3 px-4 text-slate-500">{a.email}</td>
                      <td className="py-3 px-4">{a.artworks}</td>
                      <td className="py-3 px-4 font-medium">{a.sales}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ARTWORK MODERATION */}
          {activeTab === 'Artwork Moderation' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Pending Artwork Review Queue</h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                  {pendingModerations.length} Pending
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pendingModerations.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold text-slate-800">{item.title}</h3>
                        <p className="text-sm text-slate-500">Artist: {item.artist}</p>
                        <p className="text-indigo-600 font-bold mt-2">{item.price}</p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700">
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button className="flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-red-700">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === 'Settings' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-2xl space-y-6">
              <h2 className="text-lg font-bold border-b border-slate-100 pb-3">Admin Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Platform Name</label>
                  <input type="text" defaultValue="ArtVault Gallery" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commission Rate (%)</label>
                  <input type="number" defaultValue="15" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold">
                Save Changes
              </button>
            </div>
          )}

          {/* OTHER TABS */}
          {!['Dashboard', 'Manage Artist', 'Artwork Moderation', 'Settings'].includes(activeTab) && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <Sliders className="w-12 h-12 mx-auto text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-800">{activeTab} View</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Content and dynamic management views for {activeTab.toLowerCase()}.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* QUICK MODERATION MODAL */}
      {quickModModal && selectedArtwork && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800">Review Artwork: {selectedArtwork.title}</h3>
              <button onClick={() => setQuickModModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedArtwork.img} alt="" className="w-full h-56 object-cover rounded-lg" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setQuickModModal(false)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold text-sm">
                Approve & Publish
              </button>
              <button onClick={() => setQuickModModal(false)} className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg font-semibold text-sm">
                Reject Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}