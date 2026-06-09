import React, { useState, useEffect } from 'react';
import { JobListing, StudentProfile } from './types';
import { initialProfile } from './data';
import Marketplace from './components/Marketplace';
import ProfileDashboard from './components/ProfileDashboard';
import OnboardingChat from './components/OnboardingChat';
import JobDetailModal from './components/JobDetailModal';
import { Briefcase, Sparkles, User, ShieldCheck, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'coach' | 'profile'>('marketplace');
  const [selectedGig, setSelectedGig] = useState<JobListing | null>(null);

  // App notification banner
  const [notification, setNotification] = useState<string | null>(
    "👋 Hey! Check out your new AI Match scores in the Marketplace!"
  );

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Update verified skills inside state
  const handleUpdateProfileSkills = (newSkills: string[]) => {
    setProfile(prev => ({
      ...prev,
      verifiedSkills: newSkills,
      reliabilityScore: Math.min(100, prev.reliabilityScore + (newSkills.length > prev.verifiedSkills.length ? 1 : 0))
    }));
  };

  // Finalize onboarding and change back to main view
  const handleCompleteOnboarding = () => {
    setActiveTab('marketplace');
    setNotification("🚀 Personalized matching engine initialized! Top matches recalculated.");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-gray-800 font-sans flex flex-col justify-between">
      
      {/* 1. TOP HEADER BRAND BAR (Redesigned) */}
      <header className="sticky top-4 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-card flex items-center justify-between gap-4 p-4 rounded-3xl shadow-glass-lg border border-white/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold brand-gradient shadow-md">
                SE
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-extrabold tracking-tight">SkillEarn</h1>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Stanford Sandbox</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Micro-gigs, micro-internships — start earning fast.</p>
              </div>
            </div>

            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <input
                  placeholder="Search gigs, skills, or ask AI e.g. 'React, Figma'"
                  className="w-full rounded-xl py-3 px-4 border border-white/40 bg-white/70 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <button className="text-sm text-slate-700 font-semibold">Search</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('coach')} className="text-sm bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-xl font-semibold">AI Coach</button>
              <div onClick={() => setActiveTab('profile')} className="flex items-center gap-3 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-purple-600 text-white flex items-center justify-center font-bold">{profile.name.split(' ').map(n=>n[0]).join('')}</div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold">{profile.name}</div>
                  <div className="text-[11px] text-slate-500">Reliability {profile.reliabilityScore}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN ACTIVE WINDOW */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 pb-24 text-left">
        {/* Real-time temporary success banner / notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-indigo-950 text-indigo-200 p-3.5 rounded-2xl text-xs font-semibold shadow-sm border border-indigo-900/60 flex items-center justify-between gap-2"
            >
              <span>{notification}</span>
              <button 
                onClick={() => setNotification(null)}
                className="text-indigo-400 hover:text-indigo-200 text-sm font-bold ml-1 cursor-pointer"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Screen routing based on activeTab state */}
        <div className="transition-all duration-150">
          {activeTab === 'marketplace' && (
            <Marketplace 
              onSelectGig={(gig) => setSelectedGig(gig)} 
              profile={profile} 
            />
          )}

          {activeTab === 'coach' && (
            <OnboardingChat 
              profile={profile} 
              onUpdateProfileSkills={handleUpdateProfileSkills}
              onCompleteOnboarding={handleCompleteOnboarding}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileDashboard 
              profile={profile} 
            />
          )}
        </div>
      </main>

      {/* 3. GIG DETAIL APPLICATION MODAL (OVERLAY PANEL) */}
      <AnimatePresence>
        {selectedGig && (
          <JobDetailModal
            gig={selectedGig}
            profile={profile}
            onClose={() => setSelectedGig(null)}
          />
        )}
      </AnimatePresence>

      {/* 4. SOLID DESKTOP-PAD BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-6 inset-x-6 z-50">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card flex items-center justify-between px-4 py-2 rounded-3xl shadow-glass-lg border border-white/40">
            <div className="flex items-center gap-6">
              <button onClick={() => setActiveTab('marketplace')} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${activeTab==='marketplace'? 'bg-primary-500 text-white':'text-slate-600 hover:bg-slate-100'}`}>
                <Briefcase className="w-4 h-4" /> <span className="text-sm hidden sm:inline">Marketplace</span>
              </button>

              <button onClick={() => setActiveTab('coach')} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${activeTab==='coach'? 'bg-primary-500 text-white':'text-slate-600 hover:bg-slate-100'}`}>
                <Sparkles className="w-4 h-4" /> <span className="text-sm hidden sm:inline">AI Coach</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${activeTab==='profile'? 'bg-primary-500 text-white':'text-slate-600 hover:bg-slate-100'}`}>
                <User className="w-4 h-4" /> <span className="text-sm hidden sm:inline">My Profile</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

    </div>
  );
}
