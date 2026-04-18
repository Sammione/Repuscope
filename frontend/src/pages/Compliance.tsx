import React from 'react';
import { ShieldCheck, Download } from 'lucide-react';

const Compliance: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Compliance Intelligence</h2>
          <p className="text-slate-500 mt-1">Real-time regulatory tracking across major Nigerian authorities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'FIRS Status', value: '92%', note: 'Portfolio Match', color: 'border-green-500' },
          { label: 'CAC Status', value: '88%', note: 'Active Verification', color: 'border-blue-500' },
          { label: 'SEC Compliance', value: '64%', note: 'Disclosure Rate', color: 'border-amber-500' },
          { label: 'CBN Alerts', value: '12', note: 'Pending Conflicts', color: 'border-red-500' },
        ].map(item => (
          <div key={item.label} className={`card border-l-4 ${item.color}`}>
            <div className="text-sm font-bold text-slate-500 uppercase">{item.label}</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{item.value}</div>
            <div className="text-xs text-slate-400 mt-2">{item.note}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary" />
            <h3 className="font-bold text-xl">Regulatory Heatmap Matrix</h3>
          </div>
          <button className="btn-primary bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none">
            <Download size={16} />
            Export Grid
          </button>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
           <div className="grid grid-cols-6 gap-2">
             {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className={`h-12 rounded-lg ${Math.random() > 0.7 ? 'bg-amber-400' : (Math.random() > 0.8 ? 'bg-red-400' : 'bg-green-400')} opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-sm`} title={`Entity Segment ${i}`} />
             ))}
           </div>
           <div className="flex justify-center gap-6 mt-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-sm" /> Compliant</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-sm" /> Pending Review</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-sm" /> Non-Compliant</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
