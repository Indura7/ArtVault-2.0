import React from 'react';
import { Mail, Lock } from 'lucide-react';

export default function LoginView({ setIsAuthenticated, showToast }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl mx-auto shadow-lg shadow-indigo-600/30">
            AV
          </div>
          <h2 className="text-2xl font-bold text-white">ArtVault Admin Portal</h2>
          <p className="text-xs text-slate-400">Sign in with administrative privileges</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); showToast('Logged in successfully!'); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" defaultValue="admin@artvault.com" required className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">Master Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" defaultValue="••••••••" required className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm shadow-lg shadow-indigo-600/30 transition-all">
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}