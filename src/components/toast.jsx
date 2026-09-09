import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
      toast.type === 'error' ? 'bg-red-500 text-white border-red-600' : 'bg-slate-900 text-white border-slate-800'
    }`}>
      {toast.type === 'error' ? (
        <AlertCircle className="w-5 h-5 text-red-300" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}