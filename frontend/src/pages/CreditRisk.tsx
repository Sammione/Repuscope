import React, { useState, useEffect } from 'react';
import { CreditCard, AlertOctagon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import client from '../api/client';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const CreditRisk: React.FC = () => {
  const [data, setData] = useState<{ distribution: any[], highest_risks: any[] }>({ distribution: [], highest_risks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get('/portfolio/credit');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch portfolio credit data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Credit Risk Intelligence</h2>
        <p className="text-slate-500 mt-1">Financial health, payment history, and default probability metrics derived from your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-primary" />
            <h3 className="font-bold text-xl">Credit Score Distribution</h3>
          </div>
          <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center p-4">
            {loading ? (
               <span className="text-slate-400 font-medium">Loading Database Aggregation...</span>
            ) : data.distribution.length === 0 ? (
               <span className="text-slate-400 font-medium text-sm text-center">No cached corporate data found. Search entities to build your portfolio.</span>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.distribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {data.distribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
               </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card border-red-500/20">
          <div className="flex items-center gap-3 mb-6">
            <AlertOctagon className="text-red-500" />
            <h3 className="font-bold text-xl text-red-900">Highest Default Risks (Portfolio)</h3>
          </div>
          <div className="space-y-4">
            {loading ? (
                <div className="text-slate-400 italic text-sm">Evaluating portfolio risks...</div>
            ) : data.highest_risks.length === 0 ? (
                <div className="text-slate-400 italic text-sm">No critical risks detected.</div>
            ) : data.highest_risks.map((risk, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-red-50 border border-red-100 rounded-xl hover:translate-x-1 transition-transform">
                <div>
                  <div className="font-bold text-red-900">{risk.company_name}</div>
                  <div className="text-xs text-red-700/70 font-semibold mt-1">RC Number: {risk.rc_number}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-red-600 text-xl">{risk.pd}% PD</div>
                  <div className="text-[10px] uppercase font-bold text-red-500">Grade {risk.grade}</div>
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
