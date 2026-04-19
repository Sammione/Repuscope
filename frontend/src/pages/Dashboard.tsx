import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, AlertTriangle, Clock, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import client from '../api/client';
import type { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get('/portfolio/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    const fetchTrend = async () => {
      try {
        const res = await client.get('/portfolio/trend');
        setTrendData(res.data.monthly_trend);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    fetchTrend();
  }, []);

  const kpis = [
    { 
      label: 'Coverage', 
      value: stats?.entities_monitored.toLocaleString() || '0', 
      icon: Database, 
      color: 'bg-blue-500', 
      trend: '+12%', 
      isUp: true 
    },
    { 
      label: 'High Risk', 
      value: stats?.high_risk_alerts.toString() || '0', 
      icon: AlertTriangle, 
      color: 'bg-red-500', 
      trend: '+5 today', 
      isUp: false 
    },
    { 
      label: 'Avg. Resolution', 
      value: stats?.avg_resolution_time || '0h', 
      icon: Clock, 
      color: 'bg-green-500', 
      trend: '-15%', 
      isUp: true 
    },
    { 
      label: 'Trust Score', 
      value: '78.4', 
      icon: Shield, 
      color: 'bg-amber-500', 
      trend: '+2.1', 
      isUp: true 
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h2>
        <p className="text-slate-500 mt-1">Real-time overview of portfolio reputation and risk metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card group cursor-pointer"
          >
            <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-inherit/20`}>
              <kpi.icon size={20} />
            </div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-xs font-bold mt-4 ${kpi.isUp ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Reputation Trend (Global)</h3>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 p-2">
            {!trendData || trendData.length === 0 ? (
               <p className="text-slate-400 font-medium italic text-sm">Aggregating trends...</p>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={['dataMin - 5', 'dataMax + 5']} />
                   <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ stroke: '#6366f1', strokeWidth: 2, fill: '#fff', r: 4 }} activeDot={{ r: 6 }} />
                 </LineChart>
               </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Recent Risk Alerts</h3>
            <button className="text-xs font-bold text-primary hover:text-primary-hover">View All</button>
          </div>
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="text-sm font-bold">Unverified Portfolio Match Detected</div>
                    <div className="text-xs text-slate-500">Compliance mismatch found in recent ingestion queue.</div>
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400">2m ago</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
