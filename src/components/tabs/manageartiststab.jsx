import React from 'react';
import { Search, Download, Eye } from 'lucide-react';

export default function ManageArtistsTab({
  darkMode,
  selectedArtists,
  filteredArtists,
  searchTerm,
  setSearchTerm,
  exportToCSV,
  toggleSelectAll,
  toggleSelectArtist,
  setSelectedArtistView
}) {
  return (
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
            <th className="py-3 px-4">Joined Date</th>
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
                <td className="py-3 px-4">{a.joinedDate}</td>
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
  );
}