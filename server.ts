import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { sampleJobListings } from './src/data';
import { ChatMessage, StudentProfile } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Operating in custom high-fidelity smart fallback mode.");
}

// ---------------------- API Endpoints ----------------------

// 1. Health/Config endpoint
app.get('/api/config', (req, res) => {
  res.json({
    hasRealGemini: !!ai,
    localTime: new Date().toISOString()
  });
});

// 2. Chat with AI Onboarding Coach
app.post('/api/gemini/onboard', async (req, res) => {
  try {
    const { messages, currentProfile } = req.body as { messages: ChatMessage[]; currentProfile: StudentProfile };
    
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    const lastUserMessage = messages[messages.length - 1]?.text || "";

    if (ai) {
      // Build interactive prompting context
      const prompt = `
        You are "Earnie", the dynamic and supportive AI Gig Coach for SkillEarn, a youth-oriented micro-gig and micro-internship marketplace for Stanford and college students.
        Your goal is to converse with the student, review their profile data, and guide them in starting or improving their micro-internship profile.
        
        Current student profile state:
        - Name: ${currentProfile.name}
        - University: ${currentProfile.university}
        - Major / Year: ${currentProfile.major} (${currentProfile.year})
        - Current Verified Skills: ${JSON.stringify(currentProfile.verifiedSkills)}
        
        Conversation history so far:
        ${messages.slice(-5).map(m => `${m.sender === 'ai' ? 'Earnie' : 'Student'}: ${m.text}`).join('\n')}
        
        The student's latest message: "${lastUserMessage}"
        
        Provide a lively, encouraging, and highly specific response (approx 2 to 3 sentences max) that a busy college student will love reading. Give them a practical tip on highlighting their talent or choosing gigs. Keep the tone friendly, modern, and energetic, but completely professional. Do not use markdown headers, just plain text with occasional bold highlights where beneficial.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      const responseText = response.text || "I'm excited to support you on your SkillEarn journey! Let's get your profile finalized so you can start landing micro-gigs!";
      return res.json({ text: responseText });
    } else {
      // HIGH-FIDELITY FALLBACK RESPONSES
      let reply = "";
      const lower = lastUserMessage.toLowerCase();
      
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        reply = `Hey ${currentProfile.name}! 👋 I'm Earnie, your SkillEarn guide. What kind of microcheckouts do you want to secure? We have hot marketing, dev, and Figma design gigs open right now!`;
      } else if (lower.includes("skill") || lower.includes("python") || lower.includes("react") || lower.includes("design") || lower.includes("editing")) {
        reply = `Those are high-demand skillsets here at SkillEarn! ⚡ Having verified certifications like React or Video Editing usually raises your Match score by 35%. What's your target weekly hours limit?`;
      } else if (lower.includes("pay") || lower.includes("earn") || lower.includes("money") || lower.includes("rate")) {
        reply = `Our micro-gigs pay anywhere from $18/hr up to custom tech design projects at $65/hr. 💸 The faster you complete jobs, the higher your Reliability Score becomes, which unlocks the Tier-A gigs.`;
      } else if (lower.includes("class") || lower.includes("hour") || lower.includes("exam") || lower.includes("schedule")) {
        reply = `I totally understand! 🎓 College comes first. Most micro-gigs are completely async and range between 5-10 hours a week, so you can do them on weekends or late at night.`;
      } else {
        reply = `That's an awesome perspective! 🚀 I'm updating your SkillEarn profile dashboard with these insights. You're now at onboarding milestone 3. Ready to swipe through matching skills to see your real-time matches?`;
      }

      return res.json({ text: reply });
    }
  } catch (error: any) {
    console.error("Onboarding error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 3. AI Gig Match Detail Generator
app.post('/api/gemini/match', async (req, res) => {
  try {
    const { gigId, currentProfile } = req.body as { gigId: string; currentProfile: StudentProfile };
    const gig = sampleJobListings.find(g => g.id === gigId);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found." });
    }

    if (ai) {
      const prompt = `
        You are the SkillEarn Core Matching Engine. Customize a match evaluation for ${currentProfile.name} (Stanford Junior, Major: ${currentProfile.major}, Verified Skills: ${currentProfile.verifiedSkills.join(', ')}) applying for "${gig.title}" at "${gig.company}". 
        The payout is ${gig.payRate} for ${gig.hoursPerWeek}.
        
        Analyze how their skills specifically align, why they'll stand out, and return a clean structured JSON string.
        The JSON format must strictly be:
        {
          "summary": "one compelling paragraph explaining why they are an outstanding match",
          "reasons": ["short detail point 1", "short detail point 2"],
          "tips": ["actionable interview or work tip 1", "actionable tip 2", "actionable tip 3"]
        }
        Do not output any markdown code blocks, backticks, or any conversational text. Return only the raw JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      const text = response.text?.trim() || "{}";
      // Clean JSON in case model added markdown wrappers
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      try {
        const parsed = JSON.parse(cleanJson);
        return res.json(parsed);
      } catch (e) {
        console.warn("Failed to parse Gemini JSON directly", text);
        // Fallback structured data based on generated text
        return res.json({
          summary: text.slice(0, 300) || `${currentProfile.name} possesses a superb blend of design and computer science which heavily correlates to what ${gig.company} needs.`,
          reasons: [
            "Your technical portfolio perfectly parallels their toolkit needs.",
            "Schedule aligns comfortably with your existing class commitments."
          ],
          tips: [
            "Prepare a 2-sentence summary of your fast-paced React/Figma prototypes.",
            "Present your speed-badge records to highlight your promptness.",
            "Highlight specific TikTok or tech metrics folder from recent campus gigs."
          ]
        });
      }
    } else {
      // HIGH-FIDELITY FALLBACK MATCH DATA
      const response = {
        summary: `You align incredibly well with ${gig.company} because of your verified background in ${gig.skillsRequired.slice(0, 2).join(' and ')}. Your Stanford peer-vouched project ratings (Avg 5.0★) provide instant trust with their hiring manager. Furthermore, the role's async ${gig.hoursPerWeek} layout ensures zero conflict with your midterms!`,
        reasons: [
          `Your verified skill in '${gig.skillsRequired[0] || "marketing"}' satisfies 100% of their core technical entry bar.`,
          `Your 'Speedy Delivery' badge guarantees 2x faster turn-around on their weekly sprint requirements.`,
          `An active Stanford alumni connection provides direct backchannel verification of your previous R&D contributions.`
        ],
        tips: [
          `Emphasize your 18-day active work streak on SkillEarn to prove high async accountability.`,
          `Bring a screen recording of your top Figma or React prototype to showcase immediate pixel-perfect capability.`,
          `Propose a 1-week sandbox test-run to demonstrate your rapid workflow velocity without overhead.`
        ]
      };
      return res.json(response);
    }
  } catch (error: any) {
    console.error("Match report error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 4. One-Tap Application Polish (Custom Cover Letter Generator)
app.post('/api/gemini/apply', async (req, res) => {
  try {
    const { gigId, currentProfile } = req.body as { gigId: string; currentProfile: StudentProfile };
    const gig = sampleJobListings.find(g => g.id === gigId);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found." });
    }

    if (ai) {
      const prompt = `
        You are the SkillEarn Application Polish Engine. Write a highly tailored, custom, single cover paragraph (maximum 2 punchy sentences) written on behalf of the student ${currentProfile.name} in first person to apply for the "${gig.title}" role.
        Use their academic major (${currentProfile.major}) and verified skills (${currentProfile.verifiedSkills.join(', ')}) to address the role's summary: "${gig.description}". 
        Make it high-energy, confident, clean, and customized to prove why they can start tomorrow and add instant value.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      const responseText = response.text?.trim() || `I am excited to bring my experience in modern design sprints and technical prototyping to help ${gig.company} deliver outstanding results immediately.`;
      return res.json({ polishedStatement: responseText });
    } else {
      // HIGH-FIDELITY FALLBACK RESUME POLISH
      const polishedStatement = `As a ${currentProfile.year} in ${currentProfile.major} with a perfect 5.0★ SkillEarn delivery record, I can hit the ground running with ${gig.company} by direct application of my verified '${gig.skillsRequired[0] || 'technical'}' capability. I am excited to craft high-impact deliverables that engage your audience without needing slow corporate ramp-up times!`;
      return res.json({ polishedStatement });
    }
  } catch (error: any) {
    console.error("Polish application error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});


// 5. Serve Listings
app.get('/api/listings', (req, res) => {
  res.json({ listings: sampleJobListings });
});

// Configure Vite or Static Assets based on Environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Production static files server loaded from:", distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkillEarn Running] Server listening on http://localhost:${PORT}`);
  });
}

startServer();
