import React, { useState, useEffect } from 'react';
import { Filter, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import client from '../api/client';

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444'];

const Analytics: React.FC = () => {
  const [data, setData] = useState<{ sentiment_trends: any[], sector_risks: any[] }>({ sentiment_trends: [], sector_risks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get('/portfolio/analytics');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Advanced Analytics</h2>
        <p className="text-slate-500 mt-1">Cross-entity intelligence and market benchmark trends derived from your active portfolio searches.</p>
      </div>

      <div className="card flex items-center gap-4">
        <Filter className="text-slate-400" size={20} />
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-medium outline-none">
          <option>All Industries</option>
          <option>Financial Services</option>
          <option>Agriculture</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-medium outline-none">
          <option>Region: All Nigeria</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-primary" />
            <h3 className="font-bold text-lg">Sentiment Trends (Aggregated)</h3>
          </div>
          <div className="h-64 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2">
            {loading ? (
                <span className="text-slate-400 font-medium text-sm">Aggregating trends...</span>
            ) : data.sentiment_trends.length === 0 ? (
                <span className="text-slate-400 font-medium text-sm">No data across portfolio</span>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.sentiment_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="Positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPos)" />
                    <Area type="monotone" dataKey="Negative" stroke="#ef4444" fillOpacity={1} fill="url(#colorNeg)" />
                  </AreaChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon className="text-primary" />
            <h3 className="font-bold text-lg">Risk Distribution by Sector</h3>
          </div>
          <div className="h-64 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2">
            {loading ? (
                <span className="text-slate-400 font-medium text-sm">Loading Risk Map...</span>
            ) : data.sector_risks.length === 0 ? (
                <span className="text-slate-400 font-medium text-sm">No sectors mapped</span>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.sector_risks} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {data.sector_risks.map((_, index) => (
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
      </div>

      <div className="card">
        <h3 className="font-bold text-lg mb-6">Top Negative Events (Sector Wise)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-semibold">Sector</th>
                <th className="pb-3 font-semibold">Primary Issue</th>
                <th className="pb-3 font-semibold text-center">Impact Score</th>
                <th className="pb-3 font-semibold text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="py-4 font-bold">Banking & Finance</td>
                <td className="py-4 text-slate-600">Cross-border regulatory fines and forex exposure</td>
                <td className="py-4 text-center"><span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded">High</span></td>
                <td className="py-4 text-center text-red-500 font-bold">Increasing</td>
              </tr>
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="py-4 font-bold">Oil & Gas Downstream</td>
                <td className="py-4 text-slate-600">Environmental compliance and subsidy gaps</td>
                <td className="py-4 text-center"><span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded">Medium</span></td>
                <td className="py-4 text-center text-green-500 font-bold">Decreasing</td>
              </tr>
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="py-4 font-bold">Fintech Startups</td>
                <td className="py-4 text-slate-600">Consumer data privacy breaches</td>
                <td className="py-4 text-center"><span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded">Medium</span></td>
                <td className="py-4 text-center text-red-500 font-bold">Increasing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
