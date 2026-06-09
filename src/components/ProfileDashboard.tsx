import React from 'react';
import { StudentProfile } from '../types';
import { Award, ShieldCheck, DollarSign, Briefcase, Calendar, Star, Flame, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileDashboardProps {
  profile: StudentProfile;
}

export default function ProfileDashboard({ profile }: ProfileDashboardProps) {
  // Generate mock week blocks for the active work streak grids
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeks = [
    [true, true, false, true, true, false, false],
    [true, true, true, true, true, false, false],
    [true, true, true, true, false, true, true],
    [true, true, true, true, true, true, false] // Latest week with high streak
  ];

  return (
    <div className="space-y-6">
      {/* High-Impact Hero Profile Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          {/* Profile Logo/Initial with badge status */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {profile.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <span className="absolute bottom-0 right-0 bg-green-500 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center" title="Active Core Status">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            </span>
          </div>

          <div className="text-center sm:text-left flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-gray-900 leading-none">{profile.name}</h2>
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Stanford CS
              </span>
            </div>
            
            <p className="text-sm font-medium text-gray-500 leading-tight">
              {profile.major} • {profile.year}
            </p>
            
            <p className="text-xs text-gray-400">
              {profile.university}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2 justify-center sm:justify-start">
              {profile.verifiedSkills.map((skill) => (
                <span key={skill} className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-md">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Reliability Score Speedometer indicator */}
          <div className="flex flex-col items-center justify-center bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 w-full sm:w-36">
            <span className="text-[10px] font-black tracking-widest text-indigo-700 uppercase">Reliability Score</span>
            <div className="text-3xl font-black text-indigo-600 mt-1">
              {profile.reliabilityScore}%
            </div>
            <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-2 relative overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full" 
                style={{ width: `${profile.reliabilityScore}%` }} 
              />
            </div>
            <span className="text-[9px] text-indigo-500 font-bold mt-1.5">Elite Level Reached</span>
          </div>
        </div>
      </div>

      {/* Key performance metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
          <span className="text-xs text-gray-400 font-bold tracking-wider block">LIFE-TIME EARNINGS</span>
          <div className="text-2xl font-black text-emerald-600 flex items-center justify-center mt-1">
            <DollarSign className="w-5 h-5" />
            <span>{profile.earnings}</span>
          </div>
          <span className="text-[10px] text-gray-400 block mt-0.5">Paid instant payout</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
          <span className="text-xs text-gray-400 font-bold tracking-wider block">GIGS COMPLETED</span>
          <div className="text-2xl font-black text-gray-800 flex items-center justify-center mt-1">
            <Briefcase className="w-5 h-5 text-indigo-500 mr-1" />
            <span>{profile.completedJobs}</span>
          </div>
          <span className="text-[10px] text-gray-400 block mt-0.5">100% Client Rated</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
          <span className="text-xs text-gray-400 font-bold tracking-wider block">ON-TIME RATE</span>
          <div className="text-2xl font-black text-indigo-600 flex items-center justify-center mt-1">
            <Calendar className="w-5 h-5 text-indigo-500 mr-1" />
            <span>{profile.onTimeRate}%</span>
          </div>
          <span className="text-[10px] text-gray-400 block mt-0.5">Speed-delivery standards</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
          <span className="text-xs text-gray-400 font-bold tracking-wider block">ACTIVE WORK STREAK</span>
          <div className="text-2xl font-black text-rose-500 flex items-center justify-center mt-1">
            <Flame className="w-5 h-5 text-rose-500 mr-1" />
            <span>{profile.workStreak} days</span>
          </div>
          <span className="text-[10px] text-gray-400 block mt-0.5">Top 1% Stanford tier</span>
        </div>
      </div>

      {/* Verified Badges Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5 tracking-wide uppercase mb-3">
          <Award className="w-4 h-4 text-orange-500" />
          Earned SkillEarn Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {profile.badges.map((badge, idx) => (
            <div key={badge} className="flex items-center gap-2 bg-gradient-to-br from-amber-50 to-orange-50/50 border border-orange-100/50 p-2.5 rounded-xl">
              <span className="text-lg">🔥</span>
              <div className="leading-tight">
                <span className="text-[10px] font-bold text-amber-900 block">{badge}</span>
                <span className="text-[8px] text-amber-700/80">Active Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule slots & Work Streak Tracker (Visual Calendar Grid Vibe) */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div>
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5 tracking-wide uppercase">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Availability Grid & Streak Tracker
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Visualizing your active contribution blocks on campus</p>
          </div>
          <div className="flex gap-2 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-gray-500">
              <span className="w-2.5 h-2.5 bg-gray-100 border border-gray-200 rounded"></span> Empty
            </span>
            <span className="flex items-center gap-1 text-indigo-600">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded"></span> Active Gig Block
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-between items-center bg-gray-50/50 p-4 rounded-2xl overflow-x-auto">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1.5 flex-1 min-w-[50px] items-center border-r last:border-0 border-gray-100 pr-2">
              <span className="text-[9px] font-bold text-gray-400">Wk {weekIdx + 1}</span>
              <div className="flex gap-1">
                {week.map((active, dayIdx) => (
                  <div key={dayIdx} className="flex flex-col items-center gap-1">
                    <div 
                      className={`w-4 h-4 rounded-full transition-transform ${
                        active 
                          ? 'bg-indigo-600 shadow-sm shadow-indigo-100 hover:scale-110' 
                          : 'bg-gray-100 border border-gray-200'
                      }`}
                      title={`${weekDays[dayIdx]} - ${active ? 'Active Sprint Block' : 'Exam Study block'}`}
                    />
                    <span className="text-[8px] text-gray-400 font-bold">{weekDays[dayIdx]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Works & Employer Verification History */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-gray-900 tracking-wide uppercase">Verified Project History</h3>
        <div className="space-y-3 text-left">
          {profile.experienceList.map((exp) => (
            <div key={exp.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{exp.role}</h4>
                  <span className="text-xs font-semibold text-gray-400">{exp.company} • {exp.period}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{exp.rating}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl italic mt-3 leading-relaxed border border-gray-100/50">
                "{exp.feedback}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
