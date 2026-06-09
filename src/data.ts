import { JobListing, StudentProfile } from './types';

export const initialProfile: StudentProfile = {
  name: "Alex Rivera",
  university: "Stanford University",
  major: "Computer Science & Design",
  year: "Junior",
  reliabilityScore: 98,
  badges: ["Speedy Delivery", "TikTok Growth Pioneer", "Reliable 5★", "Code Wizard"],
  earnings: 1480,
  completedJobs: 12,
  onTimeRate: 100,
  workStreak: 18,
  verifiedSkills: ["Figma", "React", "Video Editing", "Copywriting", "Python"],
  experienceList: [
    {
      id: "exp1",
      role: "Video Editing Assistant",
      company: "Aesthetic Vlogs LLC",
      period: "May 2026",
      rating: 5,
      feedback: "Alex was incredibly fast! Delivered 3 polished TikTok ads within 24 hours. Understood our brand vibes and audio styling perfectly."
    },
    {
      id: "exp2",
      role: "Figma App Prototyper",
      company: "Hatchery Incubator",
      period: "Apr 2026",
      rating: 5,
      feedback: "Exceptional UI/UX layout. Built a click-through prototype that successfully pitched our seed round. Absolute rockstar."
    },
    {
      id: "exp3",
      role: "Python Script Developer",
      company: "DataScrapers",
      period: "Mar 2026",
      rating: 4.8,
      feedback: "Great clean code, well-commented and efficient. Fixed all issues immediately."
    }
  ],
  onboardingStep: 0,
  isCompleted: true
};

export const sampleJobListings: JobListing[] = [
  {
    id: "gig-ccd",
    title: "Cafe Coffee Day - Social Media & TikTok Assistant",
    company: "Cafe Coffee Day Inc.",
    logoBgColor: "bg-amber-800",
    payRate: "$25 - $35/hr",
    category: "Marketing",
    matchScore: 98,
    matchBullets: [
      "Matches your 'TikTok Growth Pioneer' badge perfectly.",
      "Directly utilizes your verified 'Video Editing' and content scheduling skill.",
      "Requires low overhead: only 6 hours/week, perfectly fitting your Stanford class slots."
    ],
    skillsRequired: ["Video Editing", "Content Strategy", "TikTok Trends", "Canva"],
    hoursPerWeek: "6 hrs/week",
    isVerified: true,
    isHot: true,
    recentPosting: true,
    description: "Cafe Coffee Day is looking for a self-starting student creator to shoot and edit 3 high-energy short-term TikTok reels/shorts weekly. You will explore local campus coffee behaviors, tap into dynamic audio trends, and coordinate local university student coupon codes.",
    deliverables: [
      "Shoot & draft 3 raw coffee-lifestyle TikTok drafts weekly",
      "Draft dynamic captions matching the quirky youth-coffee personality",
      "Apply text-overlays and viral audio cues inside TikTok/CapCut",
      "Sync with regional marketing lead on discount analytics"
    ]
  },
  {
    id: "gig-decentral",
    title: "React & Tailwind Frontend Apprentice",
    company: "DecentralStart Labs",
    logoBgColor: "bg-indigo-900",
    payRate: "$45 - $55/hr",
    category: "Dev & Tech",
    matchScore: 94,
    matchBullets: [
      "Directly maps to your verified 'React' skills.",
      "Counts as an apprentice level role, allowing peer mentorship under Stanford alumni.",
      "Weekend-friendly: 10 hrs/week done asynchronously."
    ],
    skillsRequired: ["React", "TypeScript", "Tailwind CSS", "Git"],
    hoursPerWeek: "10 hrs/week",
    isVerified: true,
    isHot: true,
    recentPosting: true,
    description: "DecentralStart is a rapid pre-seed tooling hub. We need a talented student frontend dev to build beautiful responsive components and landing dashboards based on interactive Figma mockups. Fully remote and flexible around exam season.",
    deliverables: [
      "Convert Figma layouts to semantic React + Tailwind code",
      "Mock and connect RESTful JSON state endpoints",
      "Implement smooth state transitions utilizing Framer/Motion"
    ]
  },
  {
    id: "gig-bytedance",
    title: "Figma App UI Designer",
    company: "ByteDance Labs (R&D)",
    logoBgColor: "bg-blue-600",
    payRate: "$50 - $65/hr",
    category: "Design",
    matchScore: 97,
    matchBullets: [
      "Excellent fit with your verified skill in 'Figma' and your major in Design.",
      "Generous pay rate, featuring a bonus structure for pixel-perfect delivery.",
      "Vouching opportunity: Direct letter of recommendation from an R&D supervisor."
    ],
    skillsRequired: ["Figma", "UI/UX", "Mobile Prototyping", "Design Systems"],
    hoursPerWeek: "8 hrs/week",
    isVerified: true,
    isHot: false,
    recentPosting: true,
    description: "Help us test and design rapid prototypes for our experimental collaborative student-oriented social features. You will craft responsive wireframes, design dark/light UI presets, and compile component token schemes inside shared libraries.",
    deliverables: [
      "Build interactive click-through user flows in Figma",
      "Conduct rapid user interviews with 5 peers per concept",
      "Update visual design tokens for buttons, selectors, and panels"
    ]
  },
  {
    id: "gig-aiforge",
    title: "Python & Gemini Agent Script Optimizer",
    company: "AI Forge Studios",
    logoBgColor: "bg-emerald-800",
    payRate: "$40 - $50/hr",
    category: "Dev & Tech",
    matchScore: 99,
    matchBullets: [
      "Perfect match with your 'Computer Science' major and verified 'Python' skill.",
      "Involves building tools with modern AI structures which you are passionate about.",
      "Flexible schedule with weekly syncs."
    ],
    skillsRequired: ["Python", "Gemini API", "JSON Parsing", "Prompts"],
    hoursPerWeek: "12 hrs/week",
    isVerified: true,
    isHot: true,
    recentPosting: false,
    description: "AI Forge is automating data extraction pipelines. We are seeking a student coder to fine-tune system prompts, structure JSON schemas using @google/genai libraries, and benchmark parsing reliability across varying complex templates.",
    deliverables: [
      "Write clean Python automation scripts to consume structured JSON",
      "Evaluate prompt variations on safety, precision, and accuracy metrics",
      "Design simple streamlit interfaces to view and edit raw model completions"
    ]
  },
  {
    id: "gig-launchpad",
    title: "SEO Copywriter & Content Strategist",
    company: "LaunchPad PR Group",
    logoBgColor: "bg-rose-700",
    payRate: "$22 - $28/hr",
    category: "Writing & Content",
    matchScore: 88,
    matchBullets: [
      "Leverages your 'Copywriting' skills.",
      "Perfect for students looking to build a high-profile corporate marketing portfolio."
    ],
    skillsRequired: ["Copywriting", "SEO Optimization", "Blog Writing", "Keyword Research"],
    hoursPerWeek: "5 hrs/week",
    isVerified: false,
    isHot: false,
    recentPosting: false,
    description: "Write highly engaging, SEO-optimized articles and announcement threads targeting Gen-Z careers, micro-gigs, and gig economy innovations. The role is high autonomy, allowing you to write whenever inspiration strikes.",
    deliverables: [
      "Compose 2 SEO-optimized blog posts per week (800 words)",
      "Draft promotional highlights for LinkedIn and Twitter",
      "Implement target keywords strategically based on SEO recommendations"
    ]
  }
];
