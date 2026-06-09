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
      
      {/* 1. TOP HEADER BRAND BAR */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40 shadow-sm shadow-gray-50/20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Elegant logo mark */}
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              S⚡
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-gray-950 flex items-center gap-1">
                SkillEarn
                <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-100 uppercase tracking-widest leading-none">
                  STANFORD sandbox
                </span>
              </h1>
            </div>
          </div>

          {/* Quick User State Widget */}
          <div 
            onClick={() => setActiveTab('profile')} 
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100/80 px-2.5 py-1.5 rounded-xl border border-gray-100 cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-[10px] font-black text-white flex items-center justify-center">
              {profile.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div className="text-left hidden xs:block">
              <span className="text-[10px] text-gray-500 font-bold block leading-none">{profile.name}</span>
              <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-0.5 leading-none mt-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> Reliability: {profile.reliabilityScore}%
              </span>
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
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 z-40 shadow-xl">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-1">
          
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'marketplace'
                ? 'text-indigo-600 bg-indigo-50/50 font-black'
                : 'text-gray-400 hover:text-gray-600 font-medium'
            }`}
            id="nav-btn-marketplace"
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'coach'
                ? 'text-indigo-600 bg-indigo-50/50 font-black'
                : 'text-gray-400 hover:text-gray-600 font-medium'
            }`}
            id="nav-btn-coach"
          >
            <Sparkles className="w-5 h-5 mb-0.5 text-indigo-500" />
            <span className="text-[10px]">AI Coach</span>
            {/* Little notification status dot to prompt student onboarding */}
            {profile.verifiedSkills.length < 6 && (
              <span className="absolute top-2 right-12 w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-indigo-600 bg-indigo-50/50 font-black'
                : 'text-gray-400 hover:text-gray-600 font-medium'
            }`}
            id="nav-btn-profile"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">My Profile</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
