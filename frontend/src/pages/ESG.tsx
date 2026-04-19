import React from 'react';
import { Leaf, Sparkles } from 'lucide-react';

const ESG: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ESG Maturity Intelligence</h2>
        <p className="text-slate-500 mt-1">Environmental, Social, and Governance scoring and improvement recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="text-primary" />
            <h3 className="font-bold text-xl">Sector Benchmark Distribution</h3>
          </div>
          <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center">
            <span className="text-slate-400 font-medium">Radar Chart Loading...</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-amber-500" />
            <h3 className="font-bold text-xl">AI Recommended Actions</h3>
          </div>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
               <h4 className="font-bold text-primary mb-1">Improve Carbon Disclosures</h4>
               <p className="text-sm text-slate-600">80% of your top-tier entities lack verified scope-3 emission tracking.</p>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
               <h4 className="font-bold text-primary mb-1">Board Diversity Mandates</h4>
               <p className="text-sm text-slate-600">Consider flagging entities missing modern governance protocols to minimize PR risks.</p>
            </div>
            <button className="w-full py-3 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
               Generate Full AI Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESG;
