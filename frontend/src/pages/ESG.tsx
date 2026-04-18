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
          <div className="space-y-4">
            <div className="p-6 text-center text-sm text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-xl">
               Run ESG maturity assessments on individual entities to unlock AI strategy workflows.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESG;
