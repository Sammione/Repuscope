import React from 'react';
import { CreditCard, AlertOctagon } from 'lucide-react';

const CreditRisk: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Credit Risk Intelligence</h2>
        <p className="text-slate-500 mt-1">Financial health, payment history, and default probability metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-primary" />
            <h3 className="font-bold text-xl">Credit Score Distribution</h3>
          </div>
          <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center">
            <span className="text-slate-400 font-medium">Distribution Graph Loading...</span>
          </div>
        </div>

        <div className="card border-red-500/20">
          <div className="flex items-center gap-3 mb-6">
            <AlertOctagon className="text-red-500" />
            <h3 className="font-bold text-xl text-red-900">Highest Default Risks (Portfolio)</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-red-50 border border-red-100 rounded-xl">
                <div>
                  <div className="font-bold text-red-900">Entity Alpha Ltd.</div>
                  <div className="text-xs text-red-700/70 font-semibold mt-1">RC Number: 194827{i}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-red-600 text-xl">{(8.4 + i).toFixed(1)}% PD</div>
                  <div className="text-[10px] uppercase font-bold text-red-500">Grade D</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditRisk;
