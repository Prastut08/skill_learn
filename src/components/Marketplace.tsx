import React, { useState } from 'react';
import { JobListing, StudentProfile } from '../types';
import { sampleJobListings } from '../data';
import { Search, MapPin, DollarSign, Clock, ShieldCheck, Flame, Award, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface MarketplaceProps {
  onSelectGig: (gig: JobListing) => void;
  profile: StudentProfile;
}

export default function Marketplace({ onSelectGig, profile }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'topTier' | 'fastPay'>('all');

  // Handle category and text searching
  const filteredListings = sampleJobListings.filter(gig => {
    // Search query matching
    const matchesSearch = 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category matching
    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;

    // Filter type
    let matchesFilter = true;
    if (activeFilter === 'hot') {
      matchesFilter = gig.isHot;
    } else if (activeFilter === 'topTier') {
      // Analyze rate $45 - $55/hr
      const rateStr = gig.payRate.replace(/[^0-9]/g, ''); // extracts numbers
      const rates = rateStr.match(/.{1,2}/g)?.map(Number) || [0];
      const maxRate = Math.max(...rates);
      matchesFilter = maxRate >= 45;
    } else if (activeFilter === 'fastPay') {
      matchesFilter = gig.isVerified; // Verified ones pay directly via SkillEarn Stripe Connect instantly
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const categories = ['All', 'Design', 'Dev & Tech', 'Marketing', 'Writing & Content'];

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
            🎓 Campus Opportunities
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3">
            How do you want to <span className="text-yellow-300">earn</span> today?
          </h1>
          <p className="text-blue-100 mt-2 text-sm max-w-md">
            Matches calibrated directly with your Stanford major, verified badges, and availability.
          </p>
        </div>
        {/* Decorative ambient blobs */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 rounded-full bg-yellow-300/10 blur-lg"></div>
      </div>

      {/* AI command search bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search gigs by keyword, skill, or ask AI (e.g. 'TikTok', 'Figma', 'Python')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick filters */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => { setActiveFilter('all'); }}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
              : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
          }`}
        >
          <Award className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold">All Matches</span>
        </button>

        <button
          onClick={() => { setActiveFilter('hot'); }}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
            activeFilter === 'hot'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100'
              : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
          }`}
        >
          <Flame className="w-5 h-5 mb-1 text-orange-500 group-hover:text-amber-500" />
          <span className="text-xs font-semibold">🔥 Hot Gigs</span>
        </button>

        <button
          onClick={() => { setActiveFilter('topTier'); }}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
            activeFilter === 'topTier'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100'
              : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
          }`}
        >
          <Award className="w-5 h-5 mb-1 text-purple-600" />
          <span className="text-xs font-semibold">💎 Top Tier</span>
        </button>

        <button
          onClick={() => { setActiveFilter('fastPay'); }}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
            activeFilter === 'fastPay'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100'
              : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
          }`}
        >
          <Zap className="w-5 h-5 mb-1 text-yellow-500" />
          <span className="text-xs font-semibold">⚡ Fast Verified</span>
        </button>
      </div>

      {/* Category filters (horizontal scrollable) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selectedCategory === cat
                ? 'bg-gray-900 border-gray-900 text-theme-white text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended/Matching Headline */}
      <div className="flex justify-between items-center pt-2">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Best matches for you 
          <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
            Based on CS Major
          </span>
        </h2>
        <span className="text-xs text-gray-500 font-medium">
          {filteredListings.length} gigs found
        </span>
      </div>

      {/* Job listings container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredListings.length > 0 ? (
          filteredListings.map((gig, index) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.1 } }}
              key={gig.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between"
              id={`gig-card-${gig.id}`}
            >
              <div>
                {/* Header: Company and Match Badge */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${gig.logoBgColor}`}>
                      {gig.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500">{gig.company}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-gray-400">{gig.hoursPerWeek}</span>
                        {gig.isVerified && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Match circle indicator */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                      {gig.matchScore}% Match
                    </span>
                  </div>
                </div>

                {/* Job Title */}
                <h3 className="font-bold text-gray-800 text-base leading-snug hover:text-indigo-600 transition-colors">
                  {gig.title}
                </h3>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {gig.skillsRequired.slice(0, 3).map((skill) => {
                    const isStudentHas = profile.verifiedSkills.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                          isStudentHas 
                            ? 'bg-indigo-500/10 text-indigo-700 font-bold border border-indigo-200/50' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                  {gig.skillsRequired.length > 3 && (
                    <span className="text-[10px] text-gray-400 font-medium px-1.5 py-0.5">
                      +{gig.skillsRequired.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom section: Rate & Action */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-4">
                <div className="flex items-center text-gray-900 font-bold text-sm">
                  <DollarSign className="w-4 h-4 text-emerald-600 mr-0.5" />
                  <span>{gig.payRate}</span>
                </div>
                
                <button
                  onClick={() => onSelectGig(gig)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-indigo-100 transition-all cursor-pointer"
                  id={`btn-apply-${gig.id}`}
                >
                  Apply & Analyze
                </button>
              </div>

              {/* Optional Hot Badge bar */}
              {gig.isHot && (
                <div className="absolute top-0 right-0 h-1 w-20 bg-gradient-to-r from-orange-400 to-amber-500" />
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 py-12 text-center bg-white border border-gray-100 rounded-3xl p-6">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-700 text-base">No Matching Gigs Found</h3>
            <p className="text-gray-400 text-xs mt-1">
              Try modifying your search or click 'All matches' to explore general opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
