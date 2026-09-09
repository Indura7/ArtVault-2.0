import React from 'react';
import { Search, Download, Eye } from 'lucide-react';

export default function ManageArtworksTab({
  darkMode,
  filteredArtworks,
  searchTerm,
  setSearchTerm,
  exportToCSV,
  setSelectedArtworkView
}) {
  return (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredArtworks.length === 0 ? (
          <p className="col-span-full py-8 text-center text-slate-400">No artworks found in database.</p>
        ) : (
          filteredArtworks.map((art) => (
            <div key={art.id} className={`p-3 rounded-xl border space-y-3 transition-all ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <img src={art.img || 'https://via.placeholder.com/300'} alt={art.title} className="w-full h-40 object-cover rounded-lg" />
              <div>
                <h4 className="font-bold text-sm truncate">{art.title}</h4>
                <p className="text-xs text-slate-400 truncate">By {art.artist}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-indigo-500">${art.price}</span>
                  <button onClick={() => setSelectedArtworkView(art)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg dark:bg-slate-800 dark:text-indigo-400">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}