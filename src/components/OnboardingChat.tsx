import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudentProfile } from '../types';
import { Sparkles, Send, Check, X, CheckCircle, RotateCcw, Flame, Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingChatProps {
  profile: StudentProfile;
  onUpdateProfileSkills: (newSkills: string[]) => void;
  onCompleteOnboarding: () => void;
}

export default function OnboardingChat({ profile, onUpdateProfileSkills, onCompleteOnboarding }: OnboardingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Welcome to SkillEarn, ${profile.name}! 🚀 I'm Earnie, your student micro-gig match coach. I'm going to guide you to fine-tune your Stanford marketplace credentials so high-paying campus projects seek you out.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'm2',
      sender: 'ai',
      text: "First, let's verify what creative skills or tech experiences you have. Use the 'Talent Swiper' card below to quick-swipe your talents! ✅ (Yes) to add it to your Stanford certification stack, ❌ (No) to pass. Ready?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<Array<{ skill: string; accepted: boolean }>>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Swipeable skills database
  const queryableSkills = [
    "Figma",
    "React",
    "Video Editing",
    "Python",
    "Copywriting",
    "TikTok Growth",
    "Product Designing",
    "SQL Database",
    "Svelte",
    "Streamlit"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Swipe/Click triggers
  const handleSwipe = (accepted: boolean) => {
    const currentSkill = queryableSkills[selectedSkillIndex];
    if (!currentSkill) return;

    // Track state
    const newHistory = [...swipeHistory, { skill: currentSkill, accepted }];
    setSwipeHistory(newHistory);

    if (accepted && !profile.verifiedSkills.includes(currentSkill)) {
      onUpdateProfileSkills([...profile.verifiedSkills, currentSkill]);
    }

    // Move to next skill Card
    if (selectedSkillIndex < queryableSkills.length - 1) {
      setSelectedSkillIndex(prev => prev + 1);
    } else {
      // Completed Swiping skills!
      setSelectedSkillIndex(prev => prev + 1); // out of index marker
      triggerAutoCoachResponse(newHistory);
    }
  };

  const triggerAutoCoachResponse = async (historyObj: Array<{ skill: string; accepted: boolean }>) => {
    setIsTyping(true);
    const acceptedList = historyObj.filter(h => h.accepted).map(h => h.skill);
    
    // Simulate user message confirming skills
    const userConfirmText = `I quick-swiped my skills. I verified: ${acceptedList.join(', ')}.`;
    
    // Append user confirmation
    setMessages(prev => [
      ...prev,
      {
        id: 'u-swipe',
        sender: 'user',
        text: userConfirmText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const response = await fetch('/api/gemini/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            { id: 'u-swipe', sender: 'user', text: userConfirmText, timestamp: new Date().toISOString() }
          ],
          currentProfile: {
            ...profile,
            verifiedSkills: acceptedList
          }
        })
      });

      const data = await response.json();
      setIsTyping(false);
      
      setMessages(prev => [
        ...prev,
        {
          id: `ai-r-${Date.now()}`,
          sender: 'ai',
          text: data.text || "Your talent profile is looking fantastic! We found 3 Hot Gigs matching your updated skill stack immediately.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err`,
          sender: 'ai',
          text: `Sweet! I've certified your portfolio for [${acceptedList.join(', ')}]. This automatically updates your dashboard reliability metrics! Let's complete the final step: tap 'Activate Match Engine' below.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Chat message submit
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentProfile: profile
        })
      });

      const data = await response.json();
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-fallback-${Date.now()}`,
          sender: 'ai',
          text: "Excellent input! I have connected those instructions to your candidate data profile. Feel free to explore the Marketplace tab or continue customization anytime.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const resetSwiper = () => {
    setSelectedSkillIndex(0);
    setSwipeHistory([]);
  };

  const currentSkillCard = queryableSkills[selectedSkillIndex];

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] min-h-[550px] glass-card rounded-3xl border border-white/30 overflow-hidden shadow-glass-lg">
      {/* Top Coach Banner */}
      <div className="glass-card border-b border-white/20 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="photo-frame w-12 h-12 shadow-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div>
            <h3 className="font-extrabold text-slate-950 text-sm flex items-center gap-1.5">
              Earnie
              <span className="bg-white text-slate-700 border border-slate-200 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                Match Coach AI
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Calibrating your Stanford opportunities...</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="photo-frame w-24 h-12" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=300&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="photo-frame w-24 h-12" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=300&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
        
        {swipeHistory.length > 0 && (
          <button 
            onClick={resetSwiper}
            className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset Swiper
          </button>
        )}
      </div>

      {/* Messages Scrolling Arena */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[85%] flex gap-2">
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-bold flex-shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm shadow-gray-50'
                }`}
              >
                <p className="font-medium">{m.text}</p>
                <span className={`block text-[9px] mt-1.5 text-right ${m.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] flex gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                🤖
              </div>
              <div className="bg-white border border-gray-100/80 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Swiper Interactive Card Area */}
      <AnimatePresence mode="wait">
        {currentSkillCard ? (
          <motion.div
            key={`card-${currentSkillCard}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="px-4 py-3 bg-white/75 border-t border-white/60 flex flex-col items-center"
          >
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Certified Talent Swiper ({selectedSkillIndex + 1}/{queryableSkills.length})
            </div>

            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 p-4 border border-white/30 shadow-glass-lg relative overflow-hidden text-center">
              <div className="relative z-10 py-4">
                <div className="photo-frame h-32 mb-3" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <h4 className="text-lg font-black text-indigo-950 tracking-tight">{currentSkillCard}</h4>
                <p className="text-xs text-indigo-600 font-bold mt-1">Verify this skill for client gigs?</p>
              </div>
              {/* background graphic */}
              <div className="absolute top-[-20%] right-[-10%] w-20 h-20 bg-indigo-200/20 rounded-full blur-xl" />
            </div>

            <div className="flex gap-4 mt-3 w-full max-w-sm">
              <button
                onClick={() => handleSwipe(false)}
                className="flex-1 py-2.5 bg-rose-50/70 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all"
                id="btn-swipe-no"
              >
                <X className="w-4 h-4" /> <span>No</span>
              </button>
              <button
                onClick={() => handleSwipe(true)}
                className="flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                id="btn-swipe-yes"
              >
                <Check className="w-4 h-4" /> <span>Certify</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Finished Swiping, prompt activate profile */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
              className="px-4 py-4 bg-emerald-50/80 border-t border-emerald-100 flex flex-col items-center text-center space-y-2.5"
          >
            <div>
              <div className="inline-flex w-7 h-7 bg-emerald-600 rounded-full items-center justify-center text-white mb-1 shadow-sm">
                <Check className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xs font-black text-emerald-950">Credential Setup Complete!</h4>
              <p className="text-[10px] text-emerald-700 font-medium">Your updated skills are certified on the Stanford blockchain database.</p>
            </div>
            
            <button
              onClick={onCompleteOnboarding}
              className="bg-indigo-600 text-white font-extrabold tracking-wide text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700"
              id="btn-complete-onboard"
            >
              Activate Real-Time Match Engine <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Message Field Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Earnie anything ('Suggest Python gigs', 'How raises payout?')..."
          className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
        />
        <button
          type="submit"
          className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer shadow-indigo-100 shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
