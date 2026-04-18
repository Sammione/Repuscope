import React from 'react';
import { FileText, DownloadCloud } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report Console</h2>
          <p className="text-slate-500 mt-1">Generate comprehensive PDF briefs for stakeholder distribution.</p>
        </div>
        <button className="btn-primary">
          <DownloadCloud size={18} />
          Bulk Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Monthly Portfolio Summary', 'High-Risk Offender Brief', 'ESG Annual Compliance'].map(title => (
          <div key={title} className="card group cursor-pointer hover:border-primary/50">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
               <FileText size={24} />
            </div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-slate-500 mt-2">Automated compilation of intelligence points.</p>
            <div className="mt-6 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Generate Now <span>&rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
