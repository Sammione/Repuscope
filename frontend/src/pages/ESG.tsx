import React, { useState, useEffect } from 'react';
import { Leaf, Sparkles } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import client from '../api/client';

const ESG: React.FC = () => {
  const [data, setData] = useState<{ radar_data: any[], recommendations: any[] }>({ radar_data: [], recommendations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get('/portfolio/esg');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch ESG data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ESG Maturity Intelligence</h2>
        <p className="text-slate-500 mt-1">Environmental, Social, and Governance scoring and improvement recommendations computed across your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="text-primary" />
            <h3 className="font-bold text-xl">Sector Benchmark Distribution</h3>
          </div>
          <div className="h-64 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2">
            {loading ? (
                <span className="text-slate-400 font-medium text-sm">Evaluating maturity scores...</span>
            ) : data.radar_data.length === 0 ? (
                <span className="text-slate-400 font-medium text-sm">No benchmark data available</span>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radar_data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Portfolio ESG" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-amber-500" />
            <h3 className="font-bold text-xl">AI Recommended Actions</h3>
          </div>
          <div className="space-y-4">
            {loading ? (
               <div className="text-slate-400 italic text-sm">Generating strategic insights...</div>
            ) : data.recommendations.map((rec, i) => (
                <div key={i} className="p-4 bg-primary/5 border border-primary/10 rounded-xl transition-all hover:-translate-y-1 hover:shadow-md">
                  <h4 className="font-bold text-primary mb-1">{rec.title}</h4>
                  <p className="text-sm text-slate-600">{rec.desc}</p>
                </div>
            ))}
            <button className="w-full py-3 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200 transition-colors mt-2">
               Generate Full AI Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESG;
