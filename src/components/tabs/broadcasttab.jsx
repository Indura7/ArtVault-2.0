'use client';

import React from 'react';
import { Send, MessageSquare, Megaphone, Clock } from 'lucide-react';

export default function BroadcastTab({
  darkMode,
  broadcastText,
  setBroadcastText,
  handleSendBroadcast,
  messages = []
}) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Broadcast & Messages</h1>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Send system-wide announcements to artists or review feedback and comments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Broadcast Announcement Box */}
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">New Announcement</h2>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Broadcast a message directly to all registered artists.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Message Body
              </label>
              <textarea
                rows={5}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Type your announcement or alert message here..."
                className={`w-full p-3 text-sm rounded-lg border outline-none transition-colors ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                }`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Send Broadcast</span>
            </button>
          </form>
        </div>

        {/* Artist Comments & Feedback Inbox */}
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Recent Comments & Messages</h2>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Feedback received from the database.
                </p>
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className={`text-center py-12 text-sm ${
                  darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  No recent comments found in the database.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-indigo-500">
                        {msg.sender}
                      </span>
                      <div className={`flex items-center space-x-1 text-xs ${
                        darkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{msg.date}</span>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {msg.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}