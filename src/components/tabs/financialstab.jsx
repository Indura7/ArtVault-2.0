import React from 'react';
import { Download } from 'lucide-react';

export default function FinancialsTab({
  darkMode,
  financialOrders,
  exportToCSV
}) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Financial Orders Ledger</h2>
        <button onClick={() => exportToCSV(financialOrders, 'financial_ledger')} className="border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border-slate-700">
          <Download className="w-4 h-4" /> Export Ledger
        </button>
      </div>
      <table className="w-full text-left border-collapse mt-4">
        <thead>
          <tr className={`border-b text-xs uppercase ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'}`}>
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-sm">
          {financialOrders.map((o) => (
            <tr key={o.id}>
              <td className="py-3 px-4 font-mono">{o.id}</td>
              <td className="py-3 px-4">{o.customer}</td>
              <td className="py-3 px-4 font-bold">${o.amount}</td>
              <td className="py-3 px-4">{o.date}</td>
              <td className="py-3 px-4"><span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-semibold">{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}