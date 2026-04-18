import React from 'react';
import { BellRing, CheckCircle2 } from 'lucide-react';

const Alerts: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Command & Alert Center</h2>
        <p className="text-slate-500 mt-1">Consolidated view of negative press, compliance breaches, and risk signals.</p>
      </div>

      <div className="card">
        <h3 className="font-bold text-xl mb-6">Recent Urgent Alerts</h3>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 border border-red-200 bg-red-50 rounded-xl">
             <div className="w-10 h-10 shrink-0 bg-red-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-500/30">
               <BellRing size={20} />
             </div>
             <div className="flex-1">
               <h4 className="font-bold text-red-900">Severe Negative Sentiment Spike</h4>
               <p className="text-sm text-red-800/80 mt-1">Entity: Global Tech Ltd. (RC4519) is facing major unverified claims across 15+ news outlets.</p>
               <div className="flex gap-4 mt-3">
                 <button className="text-xs font-bold bg-white text-red-600 px-3 py-1.5 rounded border border-red-200 hover:bg-red-100 transition-colors">Start Investigation</button>
               </div>
             </div>
             <span className="text-xs font-bold text-red-400">10 mins ago</span>
          </div>

          <div className="flex gap-4 p-4 border border-slate-200 bg-white rounded-xl hover:border-slate-300 transition-colors cursor-pointer opacity-70">
             <div className="w-10 h-10 shrink-0 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-green-500/30">
               <CheckCircle2 size={20} />
             </div>
             <div className="flex-1">
               <h4 className="font-bold text-slate-900">Compliance Resolved</h4>
               <p className="text-sm text-slate-500 mt-1">Acme Corp successfully updated their FIRS tax filings.</p>
             </div>
             <span className="text-xs font-bold text-slate-400">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
