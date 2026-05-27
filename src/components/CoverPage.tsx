import React from 'react';
import { Logo } from './Logo';
import { ArrowRight, KeyRound, Building2 } from 'lucide-react';

interface CoverPageProps {
  onNavigate: (tab: 'portal' | 'admin') => void;
}

export default function CoverPage({ onNavigate }: CoverPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-16 animate-fade-in relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
        <Logo className="w-[120vw] max-w-[1000px] h-auto" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center relative z-10">
        
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 md:h-32 md:w-32 drop-shadow-xl bg-white rounded-full p-2 border border-gray-50 flex items-center justify-center">
            <Logo className="h-full w-full" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-950 font-sans tracking-tight mb-4">
          Vendhan InfoTech
        </h1>
        <p className="text-sm md:text-base text-emerald-700 font-bold uppercase tracking-[0.2em] mb-6">
          Trust in Every Byte
        </p>

        <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
          Welcome to our candidate management portal. Select an option below to proceed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={() => onNavigate('portal')}
            className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 active:scale-95"
          >
            <Building2 className="h-8 w-8 text-emerald-100 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-lg">Apply for a Job</div>
            <div className="text-xs text-emerald-100/80 font-medium">For new applicants</div>
          </button>
          
          <button
            onClick={() => onNavigate('admin')}
            className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-900 transition-all shadow-sm active:scale-95"
          >
            <KeyRound className="h-8 w-8 text-gray-400 group-hover:text-gray-900 group-hover:scale-110 transition-all" />
            <div className="font-bold text-lg">Admin Portal</div>
            <div className="text-xs text-gray-500 font-medium">For HR & Management</div>
          </button>
        </div>

      </div>
    
      <div className="mt-12 text-center text-xs text-gray-400 max-w-md relative z-10 font-medium">
        <p>10-G11, V.O.C Nagar, Dharapuram Road</p>
        <p>Oddanchatram - 624619</p>
      </div>

    </div>
  );
}
