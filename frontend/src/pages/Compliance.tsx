import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download } from 'lucide-react';
import client from '../api/client';

const Compliance: React.FC = () => {
  const [data, setData] = useState<{
    firs_status: string;
    cac_status: string;
    sec_compliance: string;
    cbn_alerts: string;
    heatmap: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get('/portfolio/compliance');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch compliance data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'FIRS Status', value: data?.firs_status || '0%', note: 'Portfolio Match', color: 'border-green-500' },
    { label: 'CAC Status', value: data?.cac_status || '0%', note: 'Active Verification', color: 'border-blue-500' },
    { label: 'SEC Compliance', value: data?.sec_compliance || '0%', note: 'Disclosure Rate', color: 'border-amber-500' },
    { label: 'CBN Alerts', value: data?.cbn_alerts || '0', note: 'Pending Conflicts', color: 'border-red-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Compliance Intelligence</h2>
          <p className="text-slate-500 mt-1">Real-time regulatory tracking across your monitored Nigerian authorities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map(item => (
          <div key={item.label} className={`card border-l-4 ${item.color}`}>
            <div className="text-sm font-bold text-slate-500 uppercase">{item.label}</div>
            <div className="text-3xl font-black text-slate-900 mt-2">
                {loading ? <span className="text-xl text-slate-300">...</span> : item.value}
            </div>
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
           {loading ? (
             <div className="flex items-center justify-center h-32">
                <span className="text-slate-400 font-medium italic">Loading Regulatory Network Matrix...</span>
             </div>
           ) : (
               <>
                 <div className="grid grid-cols-6 gap-2">
                   {data?.heatmap.map((cell) => (
                      <div 
                        key={cell.id} 
                        className={`h-12 rounded-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-sm ${
                            cell.status === 2 ? 'bg-green-400' : (cell.status === 1 ? 'bg-amber-400' : 'bg-red-400')
                        }`} 
                        title={`Entity Segment ${cell.id}`} 
                      />
                   ))}
                 </div>
                 <div className="flex justify-center gap-6 mt-6 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-sm" /> Compliant</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-sm" /> Pending Review</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-sm" /> Non-Compliant</div>
                 </div>
               </>
           )}
        </div>
      </div>
    </div>
  );
};

export default Compliance;
