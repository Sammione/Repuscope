import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, AlertTriangle, Clock, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import client from '../api/client';
import type { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get('/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
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
      value: '--', 
      icon: Shield, 
      color: 'bg-amber-500', 
      trend: 'N/A', 
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
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <p className="text-slate-400 font-medium italic">Chart visualization loading...</p>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Recent Risk Alerts</h3>
            <button className="text-xs font-bold text-primary hover:text-primary-hover">View All</button>
          </div>
          <div className="space-y-4">
             {stats?.high_risk_alerts === 0 ? (
               <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                 No active risk alerts at this time.
               </div>
             ) : (
               <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                 Alerts are currently being aggregated.
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
