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
            <div className="text-center p-6 text-sm text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-xl">
               No high-risk credit portfolios detected in the current tenant.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditRisk;
