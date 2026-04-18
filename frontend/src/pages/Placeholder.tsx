import React from 'react';

import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, description }) => {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-white border border-slate-200 rounded-3xl shadow-sm animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
         <Construction size={40} />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
      <p className="text-slate-500 text-base max-w-md mt-3">{description}</p>
      
      <div className="mt-10 flex gap-4">
        <div className="h-2 w-16 bg-slate-200 rounded-full animate-pulse" />
        <div className="h-2 w-24 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-12 bg-slate-200 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default Placeholder;
