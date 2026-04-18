import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  CreditCard, 
  Leaf, 
  Bell, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, onLogout }) => {
  const navGroups = [
    {
      label: 'Core Modules',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'entities', label: 'Entities', icon: Building2 },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'Intelligence',
      items: [
        { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
        { id: 'credit-risk', label: 'Credit Risk', icon: CreditCard },
        { id: 'esg', label: 'ESG Intelligence', icon: Leaf },
      ]
    },
    {
      label: 'Operations',
      items: [
        { id: 'alerts', label: 'Alerts', icon: Bell },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'admin', label: 'Admin', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-72 bg-sidebar-bg text-white flex flex-col h-full overflow-hidden shrink-0">
      <div className="h-20 px-6 flex items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-extrabold text-xl">
            R
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Repu<span className="text-blue-400">Scope</span>
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <div className="text-[10px] uppercase tracking-widest text-sidebar-text px-4 mb-2 font-bold opacity-60">
              {group.label}
            </div>
            {group.items.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 font-medium text-sm ${
                  activeSection === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-sidebar-text hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </motion.button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-text hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 font-medium text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
