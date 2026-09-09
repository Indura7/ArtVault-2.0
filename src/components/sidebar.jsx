import React from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';

export default function Sidebar({ menuItems, activeTab, setActiveTab, setSearchTerm, darkMode, setDarkMode, setIsAuthenticated }) {
  return (
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
  );
}