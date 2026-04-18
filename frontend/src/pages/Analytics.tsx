import React from 'react';
import { Filter, PieChart, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Advanced Analytics</h2>
        <p className="text-slate-500 mt-1">Cross-entity intelligence and market benchmark trends.</p>
      </div>

      <div className="card flex items-center gap-4">
        <Filter className="text-slate-400" size={20} />
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-medium outline-none">
          <option>All Industries</option>
          <option>Financial Services</option>
          <option>Agriculture</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-medium outline-none">
          <option>Region: All Nigeria</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-primary" />
            <h3 className="font-bold text-lg">Sentiment Trends (Aggregated)</h3>
          </div>
          <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center">
            <span className="text-slate-400 font-medium">Global Sentiment Chart Loading...</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="text-primary" />
            <h3 className="font-bold text-lg">Risk Distribution by Sector</h3>
          </div>
          <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center">
            <span className="text-slate-400 font-medium">Risk Map Loading...</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-lg mb-6">Top Negative Events (Sector Wise)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-semibold">Sector</th>
                <th className="pb-3 font-semibold">Primary Issue</th>
                <th className="pb-3 font-semibold text-center">Impact Score</th>
                <th className="pb-3 font-semibold text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td colSpan={4} className="py-8 text-center text-slate-400 italic">No historical trend data available. Awaiting cross-sector aggregation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
