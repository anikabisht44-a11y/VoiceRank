# VoiceRank — PROJECT.md

## What This Is

**VoiceRank** is an AI blog tool that:
1. Learns your writing voice from sample content
2. Shows a rank score prediction BEFORE you write
3. Generates a full blog post in YOUR voice
4. Distributes it across 5 platforms (Website, LinkedIn, Twitter, Quora, Newsletter)

**Tagline:** "The AI Blog Engine That Thinks Like a Strategist"

**Target Users:** Solo founders, D2C brand owners, content marketers with no SEO team

## Tech Stack

- Frontend: React 18 + Vite + TailwindCSS
- Editor: TipTap (headless rich text)
- State: React Context + useReducer (no Redux)
- Backend: Firebase Functions (Node.js 18)
- DB: Firestore
- Auth: Firebase Anonymous + Google
- AI: Anthropic Claude API (structured JSON output only)
- AI Detection: Hugging Face Inference API (optional, with fallback)
- Readability: text-readability (npm, local)
- Hosting: Vercel or Firebase Hosting

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] Screen 1: Voice Setup — paste content, extract voice DNA, save profile
- [ ] Screen 2: Generate — keyword input, rank score, readability, AI detection
- [ ] Screen 3: Blog Editor — TipTap editor + SEO sidebar
- [ ] Screen 4: Distribution — 5-platform preview + copy/publish
- [ ] Demo Mode — all screens work offline with pre-cached mock data
- [ ] All Claude API calls use structured JSON output
- [ ] All external calls have timeout (10-15s) + graceful fallback
- [ ] Firebase write fail → localStorage fallback

### Out of Scope (Phase 2)
- Leaderboard — future
- Decay alerts — future  
- Voice drift report — future
- CMS direct publish integrations — future

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| Claude API called from frontend | MVP/hackathon speed; env var gated | Pending |
| Demo Mode toggle | Hackathon reliability | Pending |
| No Redux | React Context sufficient for 4 screens | — |
| textstat local (not API) | No cost, no latency | — |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-03-26 after initialization*
