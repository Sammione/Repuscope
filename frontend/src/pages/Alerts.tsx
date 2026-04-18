import React from 'react';


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
           <div className="text-center p-8 text-sm text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-xl">
               No urgent alerts matching your risk criteria.
           </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
