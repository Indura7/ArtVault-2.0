import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ManageWorkshopsTab({
  darkMode,
  filteredWorkshops,
  setIsAddWorkshopOpen,
  handleDeleteWorkshop
}) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Art Workshops & Events</h2>
        <button onClick={() => setIsAddWorkshopOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Workshop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredWorkshops.map((w) => (
          <div key={w.id} className={`p-5 rounded-xl border space-y-3 relative ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <button onClick={() => handleDeleteWorkshop(w.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-base pr-6">{w.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{w.description}</p>
            <div className="text-xs space-y-1 border-t pt-2 border-slate-700/50">
              <p><strong>Date:</strong> {w.date}</p>
              <p><strong>Price:</strong> ${w.price}</p>
              <p><strong>Capacity:</strong> {w.capacity} seats</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}