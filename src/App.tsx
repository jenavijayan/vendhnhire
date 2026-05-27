import React, { useState, useEffect } from 'react';
import { Applicant } from './types';
import { MOCK_APPLICANTS } from './data/mockData';
import ApplicantForm from './components/ApplicantForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CoverPage from './components/CoverPage';
import { Logo } from './components/Logo';
import { Briefcase, KeyRound, Sparkles, Building2, User } from 'lucide-react';

export default function App() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'portal' | 'admin'>('home');

  // Load applicants & auth state from localStorage on mount
  useEffect(() => {
    const savedApplicants = localStorage.getItem('rp_applicants');
    if (savedApplicants) {
      try {
        setApplicants(JSON.parse(savedApplicants));
      } catch (e) {
        setApplicants(MOCK_APPLICANTS);
      }
    } else {
      // Seed with default realistic database
      setApplicants(MOCK_APPLICANTS);
      localStorage.setItem('rp_applicants', JSON.stringify(MOCK_APPLICANTS));
    }

    const savedSession = localStorage.getItem('rp_admin_session');
    if (savedSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Sync state changes back to localStorage
  const saveApplicantsToLocalStorage = (latest: Applicant[]) => {
    setApplicants(latest);
    localStorage.setItem('rp_applicants', JSON.stringify(latest));
  };

  // Add individual new applicant from portal
  const handleAddApplicant = (newApplicant: Applicant) => {
    setApplicants(prev => {
      const updated = [newApplicant, ...prev];
      localStorage.setItem('rp_applicants', JSON.stringify(updated));
      return updated;
    });
  };

  // Update existing applicant (status transitions, internal review comment logs)
  const handleUpdateApplicant = (updatedApplicant: Applicant) => {
    setApplicants(prev => {
      const updated = prev.map(app => 
        app.id === updatedApplicant.id ? updatedApplicant : app
      );
      localStorage.setItem('rp_applicants', JSON.stringify(updated));
      return updated;
    });
  };

  const handleBulkUpdateApplicants = (modifiedApplicants: Applicant[]) => {
    setApplicants(prev => {
      const updated = prev.map(app => {
        const mod = modifiedApplicants.find(m => m.id === app.id);
        return mod ? mod : app;
      });
      localStorage.setItem('rp_applicants', JSON.stringify(updated));
      return updated;
    });
  };

  // Admin bulk import profiles action
  const handleBulkImport = (importedApplicants: Applicant[]) => {
    setApplicants(prev => {
      const updated = [...importedApplicants, ...prev];
      localStorage.setItem('rp_applicants', JSON.stringify(updated));
      return updated;
    });
  };

  // Admin Auth triggers
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('rp_admin_session', 'true');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('rp_admin_session');
    setActiveTab('portal');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased selection:bg-gray-900 selection:text-white" id="recruitpro-application-container">
      
      {/* 1. SECURE SYSTEM GIGANTIC HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-150/70" id="main-header">
        <div className="mx-auto max-w-7xl px-4 h-16 sm:h-20 flex items-center justify-between">
          
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 text-left border-none bg-transparent cursor-pointer">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center">
              <Logo className="h-full w-full" />
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold tracking-tight text-gray-950 font-sans block leading-none">
                RecruitPro
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-wider uppercase block mt-1">
                Candidate Management Matrix
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2.5" id="navigation-tabs">
            <button
              onClick={() => setActiveTab('portal')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === 'portal' 
                  ? 'bg-gray-100 text-gray-950 shadow-xs' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Job Seekers Portal</span>
              <span className="inline sm:hidden">Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === 'admin' 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin Board</span>
              <span className="inline sm:hidden">Admin</span>
              {isAdmin && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. TAB CONTROL WORKFLOWS */}
      <main className="flex-1">
        {activeTab === 'home' ? (
          <CoverPage onNavigate={setActiveTab} />
        ) : activeTab === 'portal' ? (
          <ApplicantForm onAddApplicant={handleAddApplicant} />
        ) : (
          isAdmin ? (
            <AdminDashboard 
              applicants={applicants} 
              onUpdateApplicant={handleUpdateApplicant}
              onBulkUpdateApplicants={handleBulkUpdateApplicants}
              onBulkImport={handleBulkImport}
              onLogout={handleLogout}
            />
          ) : (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          )
        )}
      </main>

      {/* 3. PROFESSIONAL humble footer coordinates */}
      <footer className="border-t border-gray-100 bg-white py-6 mt-16" id="root-footer">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-gray-300" />
            <span>&copy; {new Date().getFullYear()} RecruitPro Software Corp. All applicant data preserved locally.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Security Protocol</span>
            <span>&bull;</span>
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
