'use client';

import React from 'react';
import { X, CheckCircle, XCircle, User, Mail, Calendar, DollarSign, Palette, Tag } from 'lucide-react';

export default function Modals({
  darkMode,
  isAddWorkshopOpen,
  setIsAddWorkshopOpen,
  newWorkshop,
  setNewWorkshop,
  handleCreateWorkshop,
  selectedArtistView,
  setSelectedArtistView,
  selectedArtworkView,
  setSelectedArtworkView,
  selectedModerationItem,
  setSelectedModerationItem,
  handleApprove,
  handleReject
}) {
  return (
    <>
      {/* 1. Add Workshop Modal */}
      {isAddWorkshopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">Add New Workshop</h3>
              <button
                onClick={() => setIsAddWorkshopOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkshop} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oil Painting Basics"
                  value={newWorkshop.title}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short summary of the workshop..."
                  value={newWorkshop.description}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newWorkshop.date}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    value={newWorkshop.price}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, price: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Capacity</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={newWorkshop.capacity}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, capacity: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Status</label>
                  <select
                    value={newWorkshop.status}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, status: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddWorkshopOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Create Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Artist Detail View Modal */}
      {selectedArtistView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl relative ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button
              onClick={() => setSelectedArtistView(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                {selectedArtistView.name ? selectedArtistView.name[0] : 'A'}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedArtistView.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedArtistView.email}</p>
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl text-sm mb-6 ${
              darkMode ? 'bg-slate-950' : 'bg-slate-50'
            }`}>
              <div>
                <p className="text-xs text-slate-400">Total Artworks</p>
                <p className="font-semibold text-base mt-0.5">{selectedArtistView.artworks}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Sales</p>
                <p className="font-semibold text-base text-indigo-500 mt-0.5">{selectedArtistView.sales}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Joined Date</p>
                <p className="font-semibold text-base mt-0.5">{selectedArtistView.joinedDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Status</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500">
                  {selectedArtistView.status || 'Active'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedArtistView(null)}
              className="w-full py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* 3. Artwork Detail View Modal */}
      {selectedArtworkView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-xl rounded-2xl overflow-hidden border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="relative h-72 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedArtworkView.img || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500'}
                alt={selectedArtworkView.title}
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setSelectedArtworkView(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-500 rounded-full">
                  {selectedArtworkView.status || 'Active'}
                </span>
                <h2 className="text-2xl font-bold mt-2">{selectedArtworkView.title}</h2>
                <p className="text-xl font-bold text-indigo-500 mt-1">${selectedArtworkView.price}</p>
              </div>

              <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl text-sm ${
                darkMode ? 'bg-slate-950' : 'bg-slate-50'
              }`}>
                <div>
                  <p className="text-xs text-slate-400">Artist</p>
                  <p className="font-semibold">{selectedArtworkView.artist}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Artist Email</p>
                  <p className="font-semibold">{selectedArtworkView.artistEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Submission Date</p>
                  <p className="font-semibold">{selectedArtworkView.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Artwork ID</p>
                  <p className="font-semibold">#{selectedArtworkView.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedArtworkView(null)}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Artwork Moderation Inspect & Action Modal */}
      {selectedModerationItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-2xl rounded-2xl overflow-hidden border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="relative h-80 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedModerationItem.img || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500'}
                alt={selectedModerationItem.title}
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setSelectedModerationItem(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/20 text-amber-500 rounded-full">
                  Pending Review
                </span>
                <h2 className="text-2xl font-bold mt-2">{selectedModerationItem.title}</h2>
                <p className="text-xl font-bold text-indigo-500 mt-1">{selectedModerationItem.price}</p>
              </div>

              <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl text-sm ${
                darkMode ? 'bg-slate-950' : 'bg-slate-50'
              }`}>
                <div>
                  <p className="text-xs text-slate-400">Artist Name</p>
                  <p className="font-semibold">{selectedModerationItem.artist}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Artist Email</p>
                  <p className="font-semibold">{selectedModerationItem.artistEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Submission Date</p>
                  <p className="font-semibold">{selectedModerationItem.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Artwork ID</p>
                  <p className="font-semibold">#{selectedModerationItem.id}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => handleApprove(selectedModerationItem.id, selectedModerationItem.title)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Approve Artwork</span>
                </button>
                <button
                  onClick={() => handleReject(selectedModerationItem.id, selectedModerationItem.title)}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Reject Artwork</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}