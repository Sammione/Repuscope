import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await client.post('/auth/register', { email, password, org_name: orgName });
        alert('Account created! Please login.');
        setIsRegister(false);
      } else {
        const res = await client.post('/auth/login', { email, password });
        localStorage.setItem('repuscope_token', res.data.access_token);
        onLoginSuccess();
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4 shadow-lg shadow-primary/30">
            R
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isRegister ? 'Create Workspace' : 'Welcome Abroad'}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {isRegister ? 'Setup your enterprise intelligence hub' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Organization Name</label>
                <input 
                  type="text" 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  required 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              required 
            />
          </div>

          {!isRegister && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 mt-4 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Workspace' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            {isRegister ? 'Already have an account?' : 'Need an enterprise account?'}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 font-bold text-primary hover:text-primary-hover transition-colors"
            >
              {isRegister ? 'Log in' : 'Register now'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
