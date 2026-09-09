import React from 'react';
import { Check, XCircle } from 'lucide-react';

export default function ModerationTab({
  darkMode,
  pendingModerations,
  handleApprove,
  handleReject
}) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <h2 className="text-lg font-bold">Pending Artwork Review Queue</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {pendingModerations.length === 0 ? (
          <p className="text-slate-400 col-span-full py-8 text-center">No pending items requiring review.</p>
        ) : (
          pendingModerations.map((item) => (
            <div key={item.id} className={`p-4 rounded-xl border space-y-3 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <img src={item.img || 'https://via.placeholder.com/300'} alt="" className="w-full h-48 object-cover rounded-lg" />
              <div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-xs text-slate-400">By {item.artist} ({item.artistEmail})</p>
                <p className="font-semibold text-indigo-500 mt-1">{item.price}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                <button onClick={() => handleApprove(item.id, item.title)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
                <button onClick={() => handleReject(item.id, item.title)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}