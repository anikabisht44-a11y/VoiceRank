🎯 What VoiceRank Is
VoiceRank is an AI tool that writes blog posts that actually sound like YOU, tells you how likely they are to rank on Google BEFORE you publish, and automatically adapts them for LinkedIn, Twitter, Quora, and newsletters.

The big idea: Every other AI tool gives you generic content. VoiceRank gives you content with your actual personality — then handles distribution so you don't have to repurpose everything manually.

🧠 How It Works (User's Perspective)
Step	What Happens
1. Teach it your voice	Paste anything you've written before (LinkedIn post, website copy, email). AI figures out your tone, sentence length, vocabulary style
2. Pick a keyword	Type what you want to rank for (e.g., "best AI blog tool India")
3. See the score	Before writing anything, it shows you "78% chance to rank in top 5" plus readability grade and AI detection score
4. Generate blog	AI writes the full blog in YOUR voice — not generic AI slop
5. Edit if needed	Simple editor where you can tweak anything. Shows SEO tips as you type
6. Distribute	One click gives you 5 versions: full blog, LinkedIn post, Twitter thread, Quora answer, newsletter excerpt
PRODUCT OVERVIEW
Field	Value
Product Name	VoiceRank
Tagline	"The AI Blog Engine That Thinks Like a Strategist"
Target Users	Solo founders, D2C brand owners, content marketers with no SEO team
Core Value	Writes blogs in user's voice, predicts rank before publish, auto-distributes to 5 platforms
2. TECH STACK
Layer	Technology	Purpose	Why
Frontend	React 18 + Vite	UI framework	Fast builds, component-based
UI Library	TailwindCSS	Styling	Utility-first, rapid development
Rich Text Editor	TipTap	Blog editor	Headless, extensible, real-time
State Management	React Context + useReducer	App state	No Redux complexity
Backend	Firebase Functions (Node.js 18)	Serverless API	Free tier, easy deployment
Database	Firestore	Data storage	Real-time, free tier
Authentication	Firebase Auth (Anonymous + Google)	User management	Simple, free
AI Provider	Anthropic Claude API	Voice extraction, blog generation, distribution	Structured JSON output, free credits
AI Detection	Hugging Face Inference API	Detect AI-written content	Free tier, fallback available
Readability	textstat (npm package)	Grade level scoring	Local, instant, no API
Hosting	Vercel or Firebase Hosting	Frontend deployment	Free, CDN included
Version Control	Git + GitHub	Code management	Standard
3. USER FLOW
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER FLOW DIAGRAM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌───────────────┐ │
│  │ Landing  │ ─→ │ Sign Up /    │ ─→ │ Dashboard   │ ─→ │ Voice Setup   │ │
│  │ Page     │    │ Anonymous    │    │ (Empty)     │    │ Screen        │ │
│  └──────────┘    └──────────────┘    └─────────────┘    └───────┬───────┘ │
│                                                                  │         │
│                                                                  ▼         │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐    ┌───────┐ │
│  │ Distribution  │ ←── │ Blog Editor   │ ←── │ Generate      │ ←── │ Voice │ │
│  │ Screen        │    │ Screen        │    │ Screen        │    │ Saved │ │
│  └───────────────┘    └───────────────┘    └───────────────┘    └───────┘ │
│         │                                                                  │
│         ▼                                                                  │
│  ┌───────────────┐                                                        │
│  │ Publish /     │                                                        │
│  │ Copy to CMS   │                                                        │
│  └───────────────┘                                                        │
│                                                                             │
│  Alternate Path: Skip Voice Setup → Use Demo Voice Profile                 │
└─────────────────────────────────────────────────────────────────────────────┘
4. SYSTEM ARCHITECTURE
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (React)                            │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────┐  │   │
│  │  │ Voice     │  │ Generate  │  │ Blog      │  │ Distribution  │  │   │
│  │  │ Setup     │  │ Screen    │  │ Editor    │  │ Screen        │  │   │
│  │  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └───────┬───────┘  │   │
│  │        │              │              │                │          │   │
│  │        └──────────────┼──────────────┼────────────────┘          │   │
│  │                       │              │                            │   │
│  │              ┌────────┴────────┐     │                            │   │
│  │              │  Services Layer │     │                            │   │
│  │              │ (API Calls)     │     │                            │   │
│  │              └────────┬────────┘     │                            │   │
│  └───────────────────────┼──────────────┼────────────────────────────┘   │
│                          │              │                                 │
│                          ▼              ▼                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    BACKEND (Firebase Functions)                     │   │
│  │                                                                     │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │   │
│  │  │ /extract-voice  │  │ /generate-blog  │  │ /distribute         │ │   │
│  │  │ POST            │  │ POST            │  │ POST                │ │   │
│  │  └────────┬────────┘  └────────┬────────┘  └──────────┬──────────┘ │   │
│  └───────────┼────────────────────┼───────────────────────┼────────────┘   │
│              │                    │                       │                 │
│              ▼                    ▼                       ▼                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      EXTERNAL APIS                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐ │   │
│  │  │ Claude API  │  │ HuggingFace │  │ textstat (local library)    │ │   │
│  │  │ (Anthropic) │  │ (optional)  │  │                             │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    FIRESTORE (Database)                              │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ users/{userId}                                              │   │   │
│  │  │   └── voiceProfile: { tone, sentenceLength, persona, ... } │   │   │
│  │  │   └── blogs: [{ id, content, keyword, scores, createdAt }] │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
5. DATA MODELS
Voice Profile (Stored in Firestore)
Field	Type	Example
tone	string	"direct", "casual", "professional", "storyteller"
sentenceLength	string	"short", "medium", "long"
vocabularyLevel	string	"simple", "moderate", "advanced"
persona	string	"educator", "peer", "expert", "founder"
keyCharacteristics	array	["uses analogies", "asks questions", "short paragraphs"]
sampleSentence	string	"Here's what I learned after 10 years..."
createdAt	timestamp	ISO date
updatedAt	timestamp	ISO date
Blog Post (Stored in Firestore)
Field	Type	Example
id	string	auto-generated
keyword	string	"best AI blog tool India"
title	string	"Blogy – Best AI Blog Automation Tool in India"
metaTitle	string	under 60 chars
metaDescription	string	under 160 chars
slug	string	"best-ai-blog-tool-india"
content	string	HTML content
rankScore	number	78
readabilityGrade	number	8
aiDetectionScore	number	7
voiceProfileId	string	reference to user's voice
createdAt	timestamp	ISO date
published	boolean	false
Distribution Package (Not Stored — Generated on Demand)
Field	Type	Example
website	string	full blog HTML
linkedin	string	300-400 word professional post
twitter	array	5 tweets
quora	string	Q&A format
newsletter	string	100-150 word excerpt with subject
6. API SPECIFICATIONS
Endpoint 1: POST /extract-voice
Field	Value
Input	{ text: string }
Output	Voice profile JSON
External Call	Claude API (structured prompt)
Timeout	10 seconds
Fallback	If Claude fails, return default "professional" profile
Endpoint 2: POST /generate-blog
Field	Value
Input	{ keyword: string, voiceProfile: object }
Output	Blog post JSON (title, meta, content, etc.)
External Call	Claude API (structured prompt with voice injection)
Timeout	15 seconds
Fallback	If Claude fails, return pre-cached demo blog
Endpoint 3: POST /score-blog
Field	Value
Input	{ content: string, keyword: string }
Output	{ rankScore, readabilityGrade, aiDetectionScore }
External Call	textstat (local), Hugging Face (optional)
Timeout	5 seconds
Fallback	If HF fails, use heuristic-based estimate
Endpoint 4: POST /distribute
Field	Value
Input	{ blogContent: string }
Output	Distribution JSON with 5 platform versions
External Call	Claude API (one call, structured output)
Timeout	12 seconds
Fallback	If Claude fails, return pre-cached demo distribution
7. SCREEN SPECIFICATIONS
Screen 1: Voice Setup
Element	Specification
Textarea	200px height, placeholder: "Paste your LinkedIn post, website copy, or any content you've written..."
Button	"Extract Voice DNA" — calls /extract-voice, shows loading spinner
Results Card	Displays extracted voice profile with labels. Shows after API success
Save Button	"Save Voice Profile" — stores to Firestore, navigates to Generate screen
Skip Option	"Try Demo Voice" — loads default voice profile, navigates to Generate screen
Screen 2: Generate
Element	Specification
Keyword Input	Single line text input, placeholder: "What keyword do you want to rank for?"
Rank Score Meter	Circular progress bar, percentage display, color: green (70-100), yellow (50-69), red (<50)
Readability Display	Shows grade level + label (e.g., "8th grade — Standard")
AI Detection Display	Shows percentage + label (e.g., "7% — Human-like")
Generate Button	Calls /generate-blog with keyword + saved voice profile, shows streaming response
Back Button	Returns to Voice Setup screen
Screen 3: Blog Editor
Element	Specification
Toolbar	Bold, italic, underline, H1, H2, bullet list, numbered list
Editor Area	Full-width, min-height 400px, real-time editing
SEO Sidebar	Shows checklist: "H1 present? ✓", "Meta title ready? ✗", "Keyword in first 100 words? ✓"
Regenerate Section Button	Select text, click to regenerate via Claude API
Continue Button	Saves blog to Firestore, navigates to Distribution screen
Screen 4: Distribution Preview
Element	Specification
Platform Tabs	Website, LinkedIn, Twitter, Quora, Newsletter
Content Display	Each tab shows formatted content in scrollable container
Copy Button	Copies content to clipboard, shows toast notification
Copy All Button	Copies all 5 versions with labels
Back Button	Returns to Editor screen
Publish Button	Marks blog as published in Firestore (future CMS integration)
8. ERROR HANDLING & FALLBACKS
Scenario	Fallback Behavior
Claude API timeout	Show retry button + "Using demo data" message. Display pre-cached example
Hugging Face API fails	Show "AI detection estimate" with asterisk. Use heuristic-based score
Firebase write fails	Store in localStorage, retry on next load
User without saved voice	Force voice setup screen, cannot proceed to generate
Keyword empty	Disable generate button, show error: "Enter a keyword"
Content generation fails	Show error message, preserve user input, offer retry
9. ENVIRONMENT VARIABLES
Variable	Purpose	Required
VITE_CLAUDE_API_KEY	Anthropic Claude API key	Yes
VITE_HF_API_KEY	Hugging Face Inference API key	No (optional)
VITE_FIREBASE_API_KEY	Firebase project API key	Yes
VITE_FIREBASE_AUTH_DOMAIN	Firebase auth domain	Yes
VITE_FIREBASE_PROJECT_ID	Firebase project ID	Yes
10. BUILD ORDER (For Implementation)
Priority	Component	Estimated Time
1	Firebase setup + Firestore schema	1 hour
2	Voice Setup screen + /extract-voice endpoint	3 hours
3	Generate screen + rank score formula	2 hours
4	/generate-blog endpoint + Claude integration	4 hours
5	Blog Editor screen + TipTap	3 hours
6	Score calculations (readability, AI detection)	2 hours
7	Distribution screen + /distribute endpoint	3 hours
8	Demo mode + pre-cached mock data	2 hours
9	Polish + error handling	2 hours
10	Demo script preparation	1 hour
Total: 23 hours (doable in 2 days with focused work)

11. DEMO MODE SPECIFICATION
For hackathon reliability, build a Demo Mode toggle:

Feature	Behavior
Demo Mode ON	All API calls use pre-cached responses. Scores are mock but look real. Voice extraction shows hardcoded "Direct, confident" profile. Generation shows pre-written blog about Blogy. Distribution shows pre-cached versions.
Demo Mode OFF	All live API calls execute normally with fallbacks
This ensures demo never fails due to API limits or network issues.                           