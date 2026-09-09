import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function SettingsTab({ darkMode, setDarkMode }) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm space-y-4 max-w-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <h2 className="text-lg font-bold">Admin Preferences</h2>
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between border-b pb-3 border-slate-800">
          <span>Dark Mode Theme</span>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-800 rounded-lg">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center justify-between border-b pb-3 border-slate-800">
          <span>Email Notifications</span>
          <input type="checkbox" defaultChecked className="accent-indigo-600" />
        </div>
      </div>
    </div>
  );
}