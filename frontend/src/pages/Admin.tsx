import React from 'react';
import { Users, Database, ShieldAlert, Key } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Administration</h2>
        <p className="text-slate-500 mt-1">Platform management, user access control, and master configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Access Control', value: 'Manage 12 Users' },
          { icon: Database, label: 'API Pipelines', value: '3 Active Connectors' },
          { icon: ShieldAlert, label: 'Audit Logs', value: 'View Security Trail' },
          { icon: Key, label: 'API Keys', value: 'Manage Integrations' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card flex items-center gap-4 cursor-pointer hover:border-slate-300">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{label}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-bold text-xl mb-4 text-red-600">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-2xl">
           The following actions are irreversible and destructive. Modifying core platform settings will instantly affect all users within your enterprise tenant.
        </p>
        <div className="space-x-4">
           <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Reset AI Cache Algorithms
           </button>
           <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">
              Purge Extracted Entity Data
           </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
