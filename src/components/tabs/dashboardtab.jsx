import React from 'react';
import { Eye } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DashboardTab({ stats, chartData, darkMode, pendingModerations, setSelectedModerationItem }) {
  return (
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
                <button onClick={() => setSelectedModerationItem(item)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg dark:bg-slate-800 dark:text-indigo-400">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}