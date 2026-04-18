import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Entities from './pages/Entities';
import Analytics from './pages/Analytics';
import Compliance from './pages/Compliance';
import CreditRisk from './pages/CreditRisk';
import ESG from './pages/ESG';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import client from './api/client';
import type { User } from './types';
import { Search, Bell, PlusCircle, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('repuscope_token'));
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await client.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('repuscope_token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login onLoginSuccess={() => setToken(localStorage.getItem('repuscope_token'))} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-slate-400 group focus-within:text-primary transition-colors">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Quick search entities..." 
              className="bg-transparent border-none outline-none font-medium text-slate-900 placeholder:text-slate-400 w-80"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20">
              <PlusCircle size={18} />
              Quick Report
            </button>
            
            <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity"
              >
                <div className="text-right hidden md:block">
                  <div className="text-sm font-bold leading-none">{user?.email.split('@')[0] || 'User'}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Risk Officer</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=6366f1&color=fff`} alt="Avatar" />
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50"
                  >
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all font-bold text-sm"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeSection === 'dashboard' && <Dashboard key="dashboard" />}
              {activeSection === 'entities' && <Entities key="entities" />}
              {activeSection === 'analytics' && <Analytics key="analytics" />}
              {activeSection === 'compliance' && <Compliance key="compliance" />}
              {activeSection === 'credit-risk' && <CreditRisk key="credit-risk" />}
              {activeSection === 'esg' && <ESG key="esg" />}
              {activeSection === 'alerts' && <Alerts key="alerts" />}
              {activeSection === 'reports' && <Reports key="reports" />}
              {activeSection === 'admin' && <Admin key="admin" />}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
