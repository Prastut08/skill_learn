import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Briefcase,
  Clock3,
  Filter,
  Flame,
  Grid2X2,
  ListChecks,
  Megaphone,
  PlusCircle,
  PlayCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  SunMedium,
  TrendingUp,
  Users,
  Zap,
  Send,
  UserCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { initialProfile, sampleJobListings } from './data';
import { JobListing, StudentProfile } from './types';

const heroImages = [
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
];

const categories = ['All', 'Design', 'Dev & Tech', 'Marketing', 'Writing & Content'];

const locationFilters = ['All', 'Campus', 'Neighborhood', 'Nearby', 'Remote'] as const;

const platformItems = [
  { id: 'talent', label: 'Find jobs', icon: Briefcase, subtitle: 'For employees / students' },
  { id: 'employer', label: 'Post jobs', icon: Megaphone, subtitle: 'For employers / hiring teams' },
] as const;

function statCard({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</div>
          <div className="mt-2 text-2xl font-black text-white">{value}</div>
          <div className="mt-1 text-sm text-slate-400">{hint}</div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function skillPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ' +
        (active
          ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-200'
          : 'border-white/10 bg-white/5 text-slate-300')
      }
    >
      {label}
    </span>
  );
}

export default function DarkApp() {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [platform, setPlatform] = useState<'talent' | 'employer'>('talent');
  const [activeSection, setActiveSection] = useState<'marketplace' | 'ai-resume'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState<(typeof locationFilters)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'top' | 'verified'>('all');
  const [selectedGig, setSelectedGig] = useState<JobListing | null>(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [resumeInput, setResumeInput] = useState('Summarize my student profile with my top hourly skills and reliable work history.');
  const [resumeOutput, setResumeOutput] = useState<string | null>(null);
  const [employerInput, setEmployerInput] = useState('Generate a company resume highlighting hourly campus openings and trusted hiring values.');
  const [employerResume, setEmployerResume] = useState<string | null>(null);
  const [notification, setNotification] = useState('Your next best gigs are ready.');
  const [jobForm, setJobForm] = useState({
    title: 'Creative Social Media Intern',
    company: 'North Star Studio',
    category: 'Marketing',
    payRate: '$30 - $40/hr',
    location: 'Campus',
    hoursPerWeek: '8 hrs/week',
    description: 'Looking for a student creator to make polished reels, manage content, and work with our marketing team.',
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setNotification('Dark workspace active. Matches updated in real time.'), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredJobs = useMemo(() => {
    return sampleJobListings.filter((gig) => {
      const matchesSearch =
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.skillsRequired.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || gig.location === selectedLocation;
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'hot' && gig.isHot) ||
        (activeFilter === 'verified' && gig.isVerified) ||
        (activeFilter === 'top' && gig.matchScore >= 95);

      return matchesSearch && matchesCategory && matchesLocation && matchesFilter && gig.workStyle === 'Hourly';
    });
  }, [activeFilter, searchQuery, selectedCategory, selectedLocation]);

  const hourlyJobs = useMemo(() => {
    return sampleJobListings.filter((gig) => gig.workStyle === 'Hourly');
  }, []);

  const topJobMatches = useMemo(() => filteredJobs.slice(0, 3), [filteredJobs]);
  const applicantPool = [
    { name: 'Avery Chen', role: 'Frontend Designer', match: 98, skills: ['React', 'Figma', 'UI Design'], location: 'Campus' },
    { name: 'Maya Patel', role: 'Video Editor', match: 96, skills: ['Video Editing', 'Content Strategy'], location: 'Neighborhood' },
    { name: 'Noah Kim', role: 'Growth Marketer', match: 94, skills: ['SEO', 'Copywriting', 'Social Media'], location: 'Remote' },
    { name: 'Jade Park', role: 'Community Manager', match: 91, skills: ['Events', 'Communication'], location: 'Campus' },
  ];

  const topApplicantMatches = useMemo(
    () => [...applicantPool].sort((a, b) => b.match - a.match).slice(0, 3),
    [applicantPool],
  );

  // Calculate match score between candidate skills and job requirements
  const calcJobMatch = (jobSkills: string[]) => {
    const matchedSkills = jobSkills.filter((skill) => profile.verifiedSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase())));
    const baseScore = Math.round((matchedSkills.length / jobSkills.length) * 70 + profile.reliabilityScore * 0.3);
    return Math.min(baseScore, 100);
  };

  // Calculate match score between job and candidate profile
  const calcCandidateMatch = (candidateSkills: string[]) => {
    const jobSkills = topJobMatches[0]?.skillsRequired || [];
    const matchedSkills = candidateSkills.filter((skill) => jobSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase())));
    return Math.round((matchedSkills.length / Math.max(jobSkills.length, 1)) * 100);
  };

  // Enhanced student resume generation with AI quality
  const generateStudentResume = () => {
    const skills = profile.verifiedSkills.slice(0, 4).join(', ');
    const topMatch = filteredJobs[0];
    const matchPercentage = topMatch ? calcJobMatch(topMatch.skillsRequired) : 85;
    
    const resume = `
**${profile.name.toUpperCase()} | ${profile.year} • ${profile.university}**
📚 ${profile.major} • Verified Student • ${profile.completedJobs} Jobs Completed

**PROFESSIONAL SUMMARY**
${profile.name} is a highly-motivated ${profile.year} student with a proven track record of reliability (${profile.reliabilityScore}% trust score). Skilled in ${skills} with demonstrated excellence in hourly, campus-based roles. ${resumeInput}

**CORE COMPETENCIES**
${profile.verifiedSkills.slice(0, 6).join(' • ')}

**KEY ACHIEVEMENTS**
✓ ${profile.completedJobs} Projects Successfully Completed
✓ ${profile.reliabilityScore}% Reliability Rating (Top Campus Performer)
✓ Campus & Neighborhood Work Specialist
✓ Fast Turnaround & High-Quality Delivery

**IDEAL FIT**
Perfectly matched for: ${topMatch?.title || 'Premium hourly roles'} (${matchPercentage}% skill match)
Available: Flexible hours for campus & neighborhood work
    `.trim();
    setResumeOutput(resume);
  };

  // Enhanced employer resume generation with AI quality
  const generateEmployerResume = () => {
    const topCandidate = topApplicantMatches[0];
    const candidateSkillMatch = topCandidate ? calcCandidateMatch(topCandidate.skills) : 90;
    
    const resume = `
**NORTH STAR STUDIO | VERIFIED EMPLOYER**
🏢 Palo Alto + University Zone • ${employerProfileSummary.status}

**COMPANY PROFILE**
Award-winning employer specializing in hourly, campus-based talent acquisition. Trusted by 1000+ verified student professionals with a strong hiring presence in local communities.

**HIRING APPROACH**
${employerInput}

**OPEN OPPORTUNITIES**
✓ 14 Active Roles Across Campus & Neighborhood
✓ Flexible Hourly Positions for Students
✓ Competitive Rates: $25-$65/hr
✓ Fast Onboarding & Real Feedback

**TOP CANDIDATE MATCH**
${topCandidate?.name || 'Premium Talent Pool'} • ${candidateSkillMatch}% Skill Alignment
Specializing in: ${topCandidate?.role || 'High-caliber hourly work'}
Skills: ${topCandidate?.skills.slice(0, 3).join(' • ') || 'Diverse expertise'}

**COMPANY VALUES**
✓ Verified, Reliable Talent Pool
✓ Fast Response & Support
✓ Quality-First Hiring Philosophy
    `.trim();
    setEmployerResume(resume);
  };

  const employeeProfileSummary = {
    title: profile.name,
    role: 'Employee profile',
    verifiedLabel: 'Verified student',
    trustLabel: 'Trusted worker',
    jobType: 'Hourly campus & neighborhood jobs',
    location: 'Stanford campus + nearby',
    status: `${profile.completedJobs} jobs completed`,
    trustScore: `${profile.reliabilityScore}% trust`,
  };

  const employerProfileSummary = {
    title: 'North Star Studio',
    role: 'Employer profile',
    verifiedLabel: 'Verified employer',
    trustLabel: 'Trusted hiring team',
    jobType: 'Hourly campus & neighborhood jobs',
    location: 'Palo Alto + university zone',
    status: '14 open roles with active hiring',
    trustScore: 'High response rate',
  };

  const employerStats = [
    { label: 'Open roles', value: '14', hint: '3 closing this week', icon: Briefcase },
    { label: 'Applicants', value: '86', hint: '12 shortlisted', icon: Users },
    { label: 'Interviews', value: '21', hint: 'Across campus teams', icon: ListChecks },
  ];

  const talentHighlights = [
    { name: 'Avery Chen', role: 'Frontend Designer', match: '98%', skills: ['React', 'Figma'], image: heroImages[0] },
    { name: 'Maya Patel', role: 'Video Editor', match: '96%', skills: ['Video Editing', 'TikTok Trends'], image: heroImages[1] },
    { name: 'Noah Kim', role: 'Growth Marketer', match: '94%', skills: ['Copywriting', 'SEO'], image: heroImages[2] },
  ];

  const heroCopy = platform === 'talent'
    ? {
        tag: 'Talent side',
        title: 'Find premium campus work in one dark, focused workspace.',
        description: 'Students browse visually rich, aligned job cards and open details without clutter.',
        image: heroImages[0],
      }
    : {
        tag: 'Employer side',
        title: 'Post jobs, review applicants, and hire from one streamlined dashboard.',
        description: 'Employers can publish roles, track interest, and review strong candidates in a clean layout.',
        image: heroImages[3],
      };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.16),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),_transparent_30%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%,transparent_78%,rgba(255,255,255,0.02))]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/95">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 text-sm font-black text-white shadow-lg shadow-cyan-500/20">
              SE
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white">SkillEarn</div>
              <div className="text-xs text-slate-400">Campus jobs for talent and employers</div>
            </div>
          </div>

          <div className="hidden lg:block flex-1 max-w-3xl px-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gigs, skills, companies, or AI prompts"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/50 focus:bg-white/8"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('marketplace')}
              className={`rounded-2xl px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold transition ${
                activeSection === 'marketplace'
                  ? 'border-cyan-400/30 bg-cyan-400/15 text-white'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveSection('ai-resume')}
              className={`rounded-2xl px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold transition ${
                activeSection === 'ai-resume'
                  ? 'border-cyan-400/30 bg-cyan-400/15 text-white'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              AI Resume
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <button className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
              <BellRing className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowProfilePanel((prev) => !prev)}
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <UserCircle className="h-4 w-4 text-cyan-300" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1500px] gap-6 px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <section className="flex min-w-0 flex-1 flex-col gap-6">
          {activeSection === 'marketplace' ? (
            <>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
                <SunMedium className="h-3.5 w-3.5" />
                {heroCopy.tag}
              </div>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[0.96]">
                {heroCopy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {heroCopy.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {platformItems.map((item) => {
                  const Icon = item.icon;
                  const active = platform === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPlatform(item.id)}
                      className={
                        'flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ' +
                        (active
                          ? 'border-cyan-400/30 bg-cyan-400/15 text-white shadow-lg shadow-cyan-500/10'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10')
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="block text-[11px] font-normal text-slate-400">{item.subtitle}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {statCard({ label: 'Reliability', value: `${profile.reliabilityScore}%`, hint: 'Top campus trust score', icon: ShieldCheck })}
                {statCard({ label: 'Earnings', value: `$${profile.earnings}`, hint: 'Lifetime payout', icon: TrendingUp })}
                {statCard({ label: 'Streak', value: `${profile.workStreak}d`, hint: 'Active working streak', icon: Flame })}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
                <div className="photo-frame h-64 rounded-[1.5rem]" style={{ backgroundImage: `url('${heroCopy.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                    <div className="text-xl font-black text-white">{filteredJobs.length}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Open gigs</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                    <div className="text-xl font-black text-white">{profile.completedJobs}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Done</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                    <div className="text-xl font-black text-white">4.9★</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Rating</div>
                  </div>
                </div>
              </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Notification</div>
                    <div className="mt-2 text-lg font-bold text-white">Platform status</div>
                  </div>
                  <button onClick={() => setNotification('Dashboard refreshed. Everything stays aligned on your screen.')} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                    Refresh
                  </button>
                </div>
                <AnimatePresence>
                  {notification && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                      {notification}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.verifiedSkills.map((skill) => (
                    <span key={skill}>{skillPill({ label: skill, active: true })}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {platform === 'talent' ? (
            <div className="space-y-6">
                <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Controls</div>
                    <h2 className="mt-2 text-xl font-bold text-white">Filter the workspace</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button key={category} onClick={() => setSelectedCategory(category)} className={'rounded-full border px-4 py-2 text-sm font-semibold transition ' + (selectedCategory === category ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-100' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10')}>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  {[
                    { id: 'all', label: 'All matches', icon: Grid2X2 },
                    { id: 'hot', label: 'Hot gigs', icon: Flame },
                    { id: 'top', label: 'Top tier', icon: Star },
                    { id: 'verified', label: 'Verified', icon: ShieldCheck },
                  ].map((item) => {
                    const active = activeFilter === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveFilter(item.id as typeof activeFilter)}
                        className={'flex items-center gap-3 rounded-2xl border p-4 text-left transition ' + (active ? 'border-cyan-400/30 bg-cyan-400/12 text-white shadow-lg shadow-cyan-500/10' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10')}
                      >
                        <div className={'flex h-10 w-10 items-center justify-center rounded-xl ' + (active ? 'bg-cyan-400/20' : 'bg-white/5')}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{item.label}</div>
                          <div className="text-xs text-slate-400">Refine results</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {locationFilters.map((location) => (
                    <button
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                      className={'rounded-full border px-4 py-2 text-sm font-semibold transition ' + (selectedLocation === location ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-100' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10')}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Marketplace</div>
                    <h2 className="mt-2 text-2xl font-black text-white">Hourly jobs near your campus or neighborhood</h2>
                  </div>
                  <div className="text-sm text-slate-400">{filteredJobs.length} gigs available</div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {filteredJobs.map((gig, index) => (
                    <motion.button
                      key={gig.id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedGig(gig)}
                      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0A1020] text-left shadow-[0_18px_50px_rgba(0,0,0,0.3)] transition hover:border-cyan-400/30"
                    >
                      <div className="photo-frame h-48" style={{ backgroundImage: `url('${heroImages[index % heroImages.length]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{gig.company}</div>
                            <h3 className="mt-2 text-xl font-black text-white leading-tight group-hover:text-cyan-100">{gig.title}</h3>
                          </div>
                          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-right">
                            <div className="text-lg font-black text-cyan-100">{gig.matchScore}%</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">Match</div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span>{skillPill({ label: gig.location, active: true })}</span>
                          <span>{skillPill({ label: gig.workStyle, active: true })}</span>
                          {gig.skillsRequired.slice(0, 3).map((skill) => (
                            <span key={skill}>{skillPill({ label: skill, active: profile.verifiedSkills.includes(skill) })}</span>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Pay</div>
                            <div className="mt-1 font-bold text-white">{gig.payRate}</div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Location</div>
                            <div className="mt-1 font-bold text-white">{gig.location}</div>
                          </div>
                          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-white/10">
                            Open details <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                </motion.section>
              </div>
          ) : (
            <div className="space-y-6">
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Employer tools</div>
                  <h2 className="mt-2 text-2xl font-black text-white">Post a role and manage applicants</h2>
                </div>
                <button className="rounded-2xl border border-cyan-400/20 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20">
                  <PlusCircle className="inline h-4 w-4" /> New job post
                </button>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.82fr]">
                <div className="rounded-[1.75rem] border border-white/10 bg-[#0A1020] p-5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
                    <BadgeCheck className="h-3.5 w-3.5" /> Create job post
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500" value={jobForm.title} onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Job title" />
                    <input className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500" value={jobForm.company} onChange={(e) => setJobForm((prev) => ({ ...prev, company: e.target.value }))} placeholder="Company" />
                    <input className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500" value={jobForm.category} onChange={(e) => setJobForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category" />
                    <input className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500" value={jobForm.location} onChange={(e) => setJobForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Campus or neighborhood" />
                    <input className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500" value={jobForm.payRate} onChange={(e) => setJobForm((prev) => ({ ...prev, payRate: e.target.value }))} placeholder="Pay rate" />
                  </div>
                  <textarea className="mt-3 min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" value={jobForm.description} onChange={(e) => setJobForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Describe the role" />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20">
                      <Send className="inline h-4 w-4" /> Publish job
                    </button>
                    <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200">
                      <Filter className="inline h-4 w-4" /> Save draft
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.75rem] border border-white/10 bg-[#0A1020] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Talent pool</div>
                        <div className="mt-2 text-lg font-bold text-white">Best candidates</div>
                      </div>
                      <Users className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div className="mt-4 space-y-3">
                      {talentHighlights.map((candidate) => (
                        <div key={candidate.name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                          <div className="photo-frame h-14 w-14 shrink-0" style={{ backgroundImage: `url('${candidate.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-white">{candidate.name}</div>
                            <div className="text-xs text-slate-400">{candidate.role}</div>
                          </div>
                          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/15 px-3 py-2 text-sm font-bold text-cyan-100">{candidate.match}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Hourly jobs</div>
                        <div className="mt-2 text-lg font-bold text-white">Roles employers can also access</div>
                      </div>
                      <Clock3 className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div className="mt-4 space-y-3">
                      {hourlyJobs.slice(0, 3).map((gig) => (
                        <div key={gig.id} className="rounded-2xl border border-white/10 bg-[#0A1020] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-white">{gig.title}</div>
                              <div className="text-xs text-slate-400">{gig.company}</div>
                            </div>
                            <div className="text-right text-sm font-bold text-cyan-100">{gig.payRate}</div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span>{skillPill({ label: gig.location, active: true })}</span>
                            <span>{skillPill({ label: gig.workStyle, active: true })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Employer stats</div>
                    <div className="mt-4 grid gap-3">
                      {employerStats.map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#0A1020] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-white">{stat.label}</div>
                              <div className="text-xs text-slate-400">{stat.hint}</div>
                            </div>
                            <div className="text-xl font-black text-white">{stat.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
            </div>
          )}
            </>
          ) : (
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[2rem] border border-white/10 bg-[#07101f] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">AI resume maker</div>
                  {platform === 'talent' ? (
                    <h2 className="mt-2 text-2xl font-black text-white">Create your resume and see perfectly matched jobs</h2>
                  ) : (
                    <h2 className="mt-2 text-2xl font-black text-white">Create an employer resume and surface top applicants</h2>
                  )}
                </div>
                <button onClick={platform === 'talent' ? generateStudentResume : generateEmployerResume} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20">
                  {platform === 'talent' ? 'Generate Student Resume' : 'Generate Employer Resume'}
                </button>
              </div>
              <textarea
                value={platform === 'talent' ? resumeInput : employerInput}
                onChange={(e) => platform === 'talent' ? setResumeInput(e.target.value) : setEmployerInput(e.target.value)}
                className="mt-4 min-h-[120px] w-full rounded-3xl border border-white/10 bg-[#0A1020] p-4 text-sm text-white outline-none placeholder:text-slate-500"
                placeholder={platform === 'talent' ? 'Add any extra details about your experience, skills, or background...' : 'Type what you want the employer resume or pitch to highlight...'}
              />
              {(platform === 'talent' ? resumeOutput : employerResume) && (
                <div className="mt-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 whitespace-pre-line">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">{platform === 'talent' ? 'Your AI Resume' : 'Employer Summary'}</div>
                  <p className="mt-3 leading-7 text-white font-mono text-sm">{platform === 'talent' ? resumeOutput : employerResume}</p>
                </div>
              )}
              <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-[#0D1629] p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{platform === 'talent' ? 'Top job matches for your resume' : 'Top applicant matches'}</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {platform === 'talent' ? (
                    filteredJobs.slice(0, 3).map((job) => {
                      const matchScore = calcJobMatch(job.skillsRequired);
                      return (
                        <div key={job.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 hover:border-cyan-400/30 transition">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                              <div className="text-xs text-slate-400 truncate">{job.company}</div>
                            </div>
                            <div className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-200 whitespace-nowrap">{matchScore}%</div>
                          </div>
                          <div className="mt-3 text-sm text-slate-300 line-clamp-2">Ideal for: {job.skillsRequired.slice(0, 2).join(', ')}</div>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">{job.payRate}</span>
                            <span className="text-slate-400">{job.location}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    topApplicantMatches.map((candidate) => (
                      <div key={candidate.name} className="rounded-3xl border border-white/10 bg-white/5 p-4 hover:border-cyan-400/30 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{candidate.name}</div>
                            <div className="text-xs text-slate-400 truncate">{candidate.role}</div>
                          </div>
                          <div className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-200 whitespace-nowrap">{candidate.match}%</div>
                        </div>
                        <div className="mt-3 text-sm text-slate-300 line-clamp-2">Skilled in: {candidate.skills.slice(0, 2).join(', ')}</div>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Campus verified</span>
                          <span className="font-semibold text-cyan-200">Ready</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </section>

        <aside className="hidden xl:flex w-[20rem] shrink-0 flex-col gap-6">
          {platform === 'talent' ? (
            <>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{employeeProfileSummary.role}</div>
                    <h3 className="mt-2 text-xl font-bold text-white">{employeeProfileSummary.title}</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 font-black text-white">AR</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span>{skillPill({ label: employeeProfileSummary.verifiedLabel, active: true })}</span>
                  <span>{skillPill({ label: employeeProfileSummary.trustLabel, active: true })}</span>
                </div>
                <div className="mt-5 space-y-3 rounded-3xl border border-white/10 bg-[#0A1020] p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-4"><span>Job type</span><span className="text-right text-white">{employeeProfileSummary.jobType}</span></div>
                  <div className="flex items-center justify-between gap-4"><span>Location</span><span className="text-right text-white">{employeeProfileSummary.location}</span></div>
                  <div className="flex items-center justify-between gap-4"><span>Status</span><span className="text-right text-white">{employeeProfileSummary.status}</span></div>
                  <div className="flex items-center justify-between gap-4"><span>Trust</span><span className="text-right text-cyan-100">{employeeProfileSummary.trustScore}</span></div>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between"><span>University</span><span className="text-white">{profile.university}</span></div>
                  <div className="flex items-center justify-between"><span>Major</span><span className="text-white">{profile.major}</span></div>
                  <div className="flex items-center justify-between"><span>Year</span><span className="text-white">{profile.year}</span></div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Photos</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {heroImages.map((image, index) => (
                    <div key={index} className="photo-frame h-28" style={{ backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{employerProfileSummary.role}</div>
                  <h3 className="mt-2 text-xl font-bold text-white">{employerProfileSummary.title}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 font-black text-white">NS</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span>{skillPill({ label: employerProfileSummary.verifiedLabel, active: true })}</span>
                <span>{skillPill({ label: employerProfileSummary.trustLabel, active: true })}</span>
              </div>
              <div className="mt-5 space-y-3 rounded-3xl border border-white/10 bg-[#0A1020] p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-4"><span>Job type</span><span className="text-right text-white">{employerProfileSummary.jobType}</span></div>
                <div className="flex items-center justify-between gap-4"><span>Location</span><span className="text-right text-white">{employerProfileSummary.location}</span></div>
                <div className="flex items-center justify-between gap-4"><span>Status</span><span className="text-right text-white">{employerProfileSummary.status}</span></div>
                <div className="flex items-center justify-between gap-4"><span>Trust</span><span className="text-right text-cyan-100">{employerProfileSummary.trustScore}</span></div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">Use the post-job form to publish hourly roles, then review candidates and shortlist applicants from a single dashboard.</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-[#0A1020] p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Hiring flow</div>
                  <div className="mt-2 text-sm font-semibold text-white">Post job → Match → Shortlist → Interview</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0A1020] p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Active searches</div>
                  <div className="mt-2 text-2xl font-black text-white">8</div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Highlights</div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3"><PlayCircle className="h-5 w-5 text-cyan-300" /> Motion-driven cards</div>
              <div className="flex items-center gap-3"><SlidersHorizontal className="h-5 w-5 text-violet-300" /> Clean alignment</div>
              <div className="flex items-center gap-3"><Zap className="h-5 w-5 text-amber-300" /> Dark premium theme</div>
            </div>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {selectedGig && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 px-3 py-3 backdrop-blur-xl sm:items-center sm:px-6">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A1020] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="photo-frame h-64" style={{ backgroundImage: `url('${heroImages[1]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">Gig overview</div>
                    <h3 className="mt-2 text-3xl font-black text-white">{selectedGig.title}</h3>
                    <p className="mt-2 text-slate-400">{selectedGig.company}</p>
                  </div>
                  <button onClick={() => setSelectedGig(null)} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">Close</button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Pay</div>
                    <div className="mt-2 text-xl font-bold text-white">{selectedGig.payRate}</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Hours</div>
                    <div className="mt-2 text-xl font-bold text-white">{selectedGig.hoursPerWeek}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span>{skillPill({ label: selectedGig.location, active: true })}</span>
                  <span>{skillPill({ label: selectedGig.workStyle, active: true })}</span>
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-300">{selectedGig.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedGig.skillsRequired.map((skill) => (
                    <span key={skill}>{skillPill({ label: skill, active: profile.verifiedSkills.includes(skill) })}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfilePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:items-center"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#090f1f] shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">Profile details</div>
                  <h3 className="mt-2 text-2xl font-black text-white">{platform === 'talent' ? profile.name : employerProfileSummary.title}</h3>
                </div>
                <button
                  onClick={() => setShowProfilePanel(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>
              <div className="grid gap-6 p-6 sm:grid-cols-[1fr_0.9fr]">
                <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-violet-600 text-2xl font-black text-white">
                      {platform === 'talent' ? 'AR' : 'NS'}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{platform === 'talent' ? 'Student profile' : 'Employer profile'}</div>
                      <div className="mt-2 text-lg font-bold text-white">{platform === 'talent' ? profile.university : employerProfileSummary.location}</div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    {platform === 'talent' ? (
                      <>
                        <div className="flex items-center justify-between gap-4"><span>Name</span><span className="text-white">{profile.name}</span></div>
                        <div className="flex items-center justify-between gap-4"><span>Major</span><span className="text-white">{profile.major}</span></div>
                        <div className="flex items-center justify-between gap-4"><span>Year</span><span className="text-white">{profile.year}</span></div>
                        <div className="flex items-center justify-between gap-4"><span>Completed jobs</span><span className="text-white">{profile.completedJobs}</span></div>
                        <div className="flex items-center justify-between gap-4"><span>Trust score</span><span className="text-cyan-100">{profile.reliabilityScore}%</span></div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-4"><span>Company</span><span className="text-white">{employerProfileSummary.title}</span></div>
                        <div className="flex items-center justify-between gap-4"><span>Location</span><span className="text-white">{employerProfileSummary.location}</span></div>
                        <div className="flex items-center justify-between gap-4"><span>Open roles</span><span className="text-white">14</span></div>
                        <div className="flex items-center justify-between gap-4"><span>Status</span><span className="text-cyan-100">{employerProfileSummary.status}</span></div>
                        <div className="flex items-center justify-between gap-4"><span>Trust</span><span className="text-cyan-100">{employerProfileSummary.trustScore}</span></div>
                      </>
                    )}
                  </div>
                  <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-[#0a1224] p-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-4"><span className="text-slate-400">Job type</span><span className="text-white">Hourly campus + neighborhood</span></div>
                    <div className="flex items-center justify-between gap-4"><span className="text-slate-400">Verified</span><span className="text-cyan-100">{platform === 'talent' ? employeeProfileSummary.verifiedLabel : employerProfileSummary.verifiedLabel}</span></div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1428] p-5 text-sm text-slate-300">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">About</div>
                  <div className="mt-4 space-y-4">
                    <p>{platform === 'talent'
                      ? 'This profile summarizes your trusted student credentials, hourly job experience, and availability for neighborhood or campus work.'
                      : 'This employer profile shows your verified hiring presence and active hourly roles in the campus and nearby neighborhoods.'
                    }</p>
                    {platform === 'talent' ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <UserCircle className="h-4 w-4 text-cyan-300" /> {profile.university} • {profile.major}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profile.badges.map((badge) => (
                            <span key={badge} className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">{badge}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <UserCircle className="h-4 w-4 text-cyan-300" /> {profile.university} • {profile.major}
                        </div>
                        <div className="grid gap-2">
                          <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">Verified employer</span>
                          <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">High response rate</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
