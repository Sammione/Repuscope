import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building, Shield, CreditCard, Leaf, Newspaper, FileText, ChevronRight } from 'lucide-react';
import client from '../api/client';
import type { Entity, ReputationData, ESGAssessment, CreditRisk, NewsArticle, ComplianceRecord } from '../types';

const Entities: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState<Entity | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Module States
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [esg, setEsg] = useState<ESGAssessment | null>(null);
  const [credit, setCredit] = useState<CreditRisk | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [compliance, setCompliance] = useState<ComplianceRecord[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await client.get(`/verify?rc_number=${query}`);
      setEntity(res.data);
      fetchAllIntelligence(res.data.rc_number, res.data.company_name);
    } catch (err) {
      alert('Entity not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllIntelligence = async (rc: string, name: string) => {
    try {
      const [repRes, esgRes, creditRes, newsRes, compRes] = await Promise.all([
        client.get(`/reputation/${rc}`),
        client.get(`/esg/${rc}`),
        client.get(`/credit-risk/${rc}`),
        client.get(`/intelligence/${encodeURIComponent(name)}?rc_number=${rc}`),
        client.get(`/compliance/${rc}`)
      ]);
      setReputation(repRes.data);
      setEsg(esgRes.data);
      setCredit(creditRes.data);
      setNews(newsRes.data);
      setCompliance(compRes.data);
    } catch (err) {
      console.error('Failed to fetch intelligence modules', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'reputation', label: 'Reputation', icon: Shield },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'credit', label: 'Credit', icon: CreditCard },
    { id: 'esg', label: 'ESG', icon: Leaf },
    { id: 'news', label: 'News Feed', icon: Newspaper },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Entity Intelligence</h2>
          <p className="text-slate-500 mt-1">Due diligence and reputation monitoring for Nigerian enterprises.</p>
        </div>
        <form onSubmit={handleSearch} className="relative group min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="RC Number (e.g. RC1234567)"
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm transition-all font-medium" 
          />
          {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
        </form>
      </div>

      {!entity ? (
        <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
             <Building size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Search for an entity</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-2">Enter a verified CAC RC-Number to begin technical due diligence and reputation analysis.</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Entity Summary Header */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <Building size={40} />
               </div>
               <div>
                 <h1 className="text-2xl font-black text-slate-900 uppercase">{entity.company_name}</h1>
                 <div className="flex flex-wrap gap-2 mt-2">
                   <span className="bg-primary/10 text-primary text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase">
                     {entity.rc_number} • CAC {entity.status}
                   </span>
                   <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase ${
                     reputation?.risk_level === 'Low' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                     Risk Level: {reputation?.risk_level || 'Pending'}
                   </span>
                 </div>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center font-black text-xl text-primary">
                    {reputation?.score || '--'}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Reputation</div>
               </div>
               <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center font-black text-xl text-green-600">
                    {credit?.grade || '--'}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Credit</div>
               </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Pane */}
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="min-h-[400px]"
             >
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="card">
                      <h3 className="font-bold mb-4">Registration Details</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Address</div>
                          <div className="text-sm font-medium mt-1">{entity.registered_address || 'Not Available'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Directors</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                             {entity.directors.length > 0 ? entity.directors.map(d => (
                               <span key={d} className="bg-slate-100 px-2 py-1 rounded text-[10px] font-medium">{d}</span>
                             )) : <span className="text-xs text-slate-400 italic">No records found</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Add more overview cards... */}
                  </div>
                )}

                {activeTab === 'news' && (
                   <div className="grid grid-cols-1 gap-4">
                      {news.map((art, idx) => (
                        <div key={idx} className="card flex gap-6 hover:translate-x-1">
                           <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-white ${
                             art.sentiment === 'Positive' ? 'bg-green-500' : (art.sentiment === 'Negative' ? 'bg-red-500' : 'bg-slate-400')
                           }`}>
                             {art.sentiment[0]}
                           </div>
                           <div className="flex-1">
                             <a href={art.url} target="_blank" rel="noreferrer" className="font-bold text-slate-900 hover:text-primary transition-colors block leading-tight">
                               {art.title}
                             </a>
                             <p className="text-sm text-slate-500 mt-2 line-clamp-2">{art.description}</p>
                             <div className="flex items-center gap-4 mt-3">
                               <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded">{art.source}</span>
                               <span className="text-[10px] font-black uppercase text-slate-400">{new Date(art.published_at).toLocaleDateString()}</span>
                             </div>
                           </div>
                           <ChevronRight className="self-center text-slate-300" size={20} />
                        </div>
                      ))}
                   </div>
                )}

                {activeTab === 'esg' && esg && (
                  <div className="card max-w-2xl">
                    <h3 className="font-bold text-xl mb-6">ESG Maturity Assessment</h3>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                       <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                          <div className="text-3xl font-black text-green-600">{esg.environmental}</div>
                          <div className="text-[10px] font-bold uppercase text-green-700 mt-1">Env</div>
                       </div>
                       <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <div className="text-3xl font-black text-blue-600">{esg.social}</div>
                          <div className="text-[10px] font-bold uppercase text-blue-700 mt-1">Social</div>
                       </div>
                       <div className="text-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                          <div className="text-3xl font-black text-indigo-600">{esg.governance}</div>
                          <div className="text-[10px] font-bold uppercase text-indigo-700 mt-1">Gov</div>
                       </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 mb-2">Summary</div>
                      <p className="text-slate-500 text-sm leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {esg.summary}
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === 'reputation' && reputation && (
                  <div className="card">
                    <h3 className="font-bold text-xl mb-4">Reputation Assessment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Sentiment Polarity</div>
                        <div className="text-xl font-black">{reputation.sentiment_polarity}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Compliance Subscore</div>
                        <div className="text-xl font-black">{reputation.compliance_subscore}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'compliance' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {compliance.length === 0 ? (
                      <div className="col-span-full text-slate-500 italic p-4 bg-slate-50 rounded-xl text-sm">
                         No compliance records found in the database.
                      </div>
                    ) : (
                      compliance.map((comp, idx) => (
                        <div key={idx} className={`card border-l-4 ${comp.status === 'Compliant' ? 'border-green-500' : (comp.status === 'Overdue' ? 'border-red-500' : 'border-amber-500')}`}>
                          <h3 className="font-bold text-lg mb-2">{comp.agency}</h3>
                          <div className={`font-bold ${comp.status === 'Compliant' ? 'text-green-600' : (comp.status === 'Overdue' ? 'text-red-600' : 'text-amber-600')}`}>
                            Status: {comp.status}
                          </div>
                          {comp.last_verified && <div className="text-xs text-slate-400 mt-2">Verified: {new Date(comp.last_verified).toLocaleDateString()}</div>}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'credit' && credit && (
                  <div className="card max-w-xl">
                    <h3 className="font-bold text-xl mb-4">Credit Risk Profile</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500">Risk Grade</span>
                        <span className="font-bold text-green-600">{credit.grade}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500">Probability of Default</span>
                        <span className="font-bold">{(credit.probability_of_default * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500">Debt Pressure</span>
                        <span className="font-bold">{credit.debt_pressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Market Outlook</span>
                        <span className="font-bold">{credit.outlook}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div className="card">
                    <h3 className="font-bold text-xl mb-4">Generate Intel Report</h3>
                    <p className="text-slate-500 mb-6">Export a comprehensive PDF due diligence report for {entity.company_name}.</p>
                    <button className="btn-primary">
                      <FileText size={18} />
                      Export Standard Report
                    </button>
                  </div>
                )}
             </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Entities;
