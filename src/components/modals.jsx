import React from 'react';
import { X } from 'lucide-react';

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
      {/* CREATE WORKSHOP MODAL */}
      {isAddWorkshopOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`p-6 rounded-2xl border w-full max-w-md space-y-4 shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Create New Workshop</h3>
              <button onClick={() => setIsAddWorkshopOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateWorkshop} className="space-y-3 text-sm">
              <input type="text" placeholder="Title" required value={newWorkshop.title} onChange={(e) => setNewWorkshop({...newWorkshop, title: e.target.value})} className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
              <textarea placeholder="Description" rows="3" required value={newWorkshop.description} onChange={(e) => setNewWorkshop({...newWorkshop, description: e.target.value})} className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}></textarea>
              <input type="date" required value={newWorkshop.date} onChange={(e) => setNewWorkshop({...newWorkshop, date: e.target.value})} className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Price ($)" required value={newWorkshop.price} onChange={(e) => setNewWorkshop({...newWorkshop, price: e.target.value})} className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                <input type="number" placeholder="Capacity" required value={newWorkshop.capacity} onChange={(e) => setNewWorkshop({...newWorkshop, capacity: e.target.value})} className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-300'}`} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg">Save Workshop</button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ARTIST MODAL */}
      {selectedArtistView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`p-6 rounded-2xl border w-full max-w-sm space-y-4 shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-800">
              <h3 className="font-bold text-lg">Artist Profile Details</h3>
              <button onClick={() => setSelectedArtistView(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedArtistView.name}</p>
              <p><strong>Email:</strong> {selectedArtistView.email}</p>
              <p><strong>Artworks Uploaded:</strong> {selectedArtistView.artworks}</p>
              <p><strong>Joined Date:</strong> {selectedArtistView.joinedDate}</p>
              <p><strong>Status:</strong> {selectedArtistView.status}</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ARTWORK MODAL */}
      {selectedArtworkView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`p-6 rounded-2xl border w-full max-w-md space-y-4 shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-800">
              <h3 className="font-bold text-lg">{selectedArtworkView.title}</h3>
              <button onClick={() => setSelectedArtworkView(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <img src={selectedArtworkView.img || 'https://via.placeholder.com/400'} alt="" className="w-full h-56 object-cover rounded-lg" />
            <div className="space-y-1 text-sm">
              <p><strong>Artist:</strong> {selectedArtworkView.artist}</p>
              <p><strong>Email:</strong> {selectedArtworkView.artistEmail}</p>
              <p><strong>Price:</strong> ${selectedArtworkView.price}</p>
              <p><strong>Date Added:</strong> {selectedArtworkView.date}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODERATION DETAIL MODAL */}
      {selectedModerationItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`p-6 rounded-2xl border w-full max-w-md space-y-4 shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-800">
              <h3 className="font-bold text-lg">Review Artwork Submission</h3>
              <button onClick={() => setSelectedModerationItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <img src={selectedModerationItem.img || 'https://via.placeholder.com/400'} alt="" className="w-full h-56 object-cover rounded-lg" />
            <div className="space-y-1 text-sm">
              <p><strong>Title:</strong> {selectedModerationItem.title}</p>
              <p><strong>Artist:</strong> {selectedModerationItem.artist}</p>
              <p><strong>Price:</strong> {selectedModerationItem.price}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => handleApprove(selectedModerationItem.id, selectedModerationItem.title)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-semibold">
                Approve
              </button>
              <button onClick={() => handleReject(selectedModerationItem.id, selectedModerationItem.title)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-semibold">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}