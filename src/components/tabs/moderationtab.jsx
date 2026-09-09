'use client';

import React from 'react';
import { CheckCircle, XCircle, Eye, AlertCircle, Calendar, User, Tag } from 'lucide-react';

export default function ModerationTab({
  darkMode,
  pendingModerations = [],
  handleApprove,
  handleReject,
  setSelectedModerationItem // Artwork එක Detail View කිරීමට මෙය භාවිතා කරයි
}) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Artwork Moderation</h1>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Review pending artwork submissions before approving them for the marketplace.
        </p>
      </div>

      {/* Moderation List Grid */}
      {pendingModerations.length === 0 ? (
        <div className={`p-12 text-center rounded-xl border ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
          <h3 className="text-lg font-semibold mb-1">No Pending Submissions</h3>
          <p className="text-sm">All submitted artworks have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingModerations.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col justify-between ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                {/* Artwork Image Container */}
                <div 
                  className="relative h-52 bg-slate-950 overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedModerationItem(item)}
                >
                  <img
                    src={item.img || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/90 text-slate-900 rounded-lg text-xs font-semibold shadow-md">
                      <Eye className="w-4 h-4" />
                      <span>Click to Inspect</span>
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                    Pending
                  </span>
                </div>

                {/* Info Area */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg leading-snug truncate">{item.title}</h3>
                    <span className="text-indigo-600 font-bold text-base ml-2">{item.price}</span>
                  </div>

                  <div className={`space-y-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <p className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate">{item.artist} ({item.artistEmail})</span>
                    </p>
                    <p className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Submitted: {item.date}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`p-4 pt-0 grid grid-cols-3 gap-2 border-t mt-3 ${
                darkMode ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <button
                  onClick={() => setSelectedModerationItem(item)}
                  className={`col-span-1 flex items-center justify-center space-x-1 py-2 px-2 text-xs font-semibold rounded-lg transition-colors ${
                    darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => handleApprove(item.id, item.title)}
                  className="col-span-1 flex items-center justify-center space-x-1 py-2 px-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => handleReject(item.id, item.title)}
                  className="col-span-1 flex items-center justify-center space-x-1 py-2 px-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}