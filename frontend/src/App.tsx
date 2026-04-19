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
import { Bell, PlusCircle, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('repuscope_token'));
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive Positioning */}
      <div className={`fixed inset-y-0 left-0 z-50 md:relative md:flex transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={(s) => { setActiveSection(s); setIsSidebarOpen(false); }} 
          onLogout={handleLogout}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-slate-800">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 className="font-black text-lg md:text-xl tracking-tight">Workspace</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-105"
            >
              <PlusCircle size={18} />
              Quick Report
            </button>
            
            <button className="hidden md:flex relative w-10 h-10 items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
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
        <section className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">
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
