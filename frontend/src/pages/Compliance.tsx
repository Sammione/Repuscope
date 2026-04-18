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
          { label: 'FIRS Status', value: '--', note: 'Awaiting Pipeline', color: 'border-slate-300' },
          { label: 'CAC Status', value: '--', note: 'Awaiting Pipeline', color: 'border-slate-300' },
          { label: 'SEC Compliance', value: '--', note: 'Awaiting Pipeline', color: 'border-slate-300' },
          { label: 'CBN Alerts', value: '0', note: 'Awaiting Pipeline', color: 'border-slate-300' },
        ].map(item => (
          <div key={item.label} className={`card border-l-4 ${item.color}`}>
            <div className="text-sm font-bold text-slate-500 uppercase">{item.label}</div>
            <div className="text-3xl font-black text-slate-400 mt-2">{item.value}</div>
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
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex items-center justify-center min-h-[200px]">
           <span className="text-slate-400 italic">Matrix data source disconnected. Run entity assessments to build matrix.</span>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
