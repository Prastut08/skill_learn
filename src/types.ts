export interface JobListing {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  logoBgColor: string;
  payRate: string;
  location: 'Campus' | 'Neighborhood' | 'Nearby' | 'Remote';
  workStyle: 'Hourly' | 'Project';
  category: 'Design' | 'Dev & Tech' | 'Writing & Content' | 'Marketing' | 'Business' | 'Other';
  matchScore: number;
  matchBullets: string[];
  skillsRequired: string[];
  hoursPerWeek: string;
  isVerified: boolean;
  isHot: boolean;
  recentPosting: boolean;
  description: string;
  deliverables: string[];
}

export interface StudentProfile {
  name: string;
  university: string;
  major: string;
  year: string;
  reliabilityScore: number;
  badges: string[];
  earnings: number;
  completedJobs: number;
  onTimeRate: number;
  workStreak: number; // in days
  verifiedSkills: string[];
  experienceList: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    rating: number;
    feedback: string;
  }>;
  onboardingStep: number;
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}
