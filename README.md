# TelltaleProof — AI vs Human Content Detector

Deep, explainable AI content analysis across 30+ signals. Prove your content is human.

## Phase 1 Features
- 8 scored sections, 30+ individual factors
- Bullet-point explanations for every score
- Aggregate score with verdict and confidence level
- Clean dark UI, fully mobile-friendly
- Powered by Claude API

## Phase 2 Roadmap
- True perplexity scoring via Hugging Face GPT-2
- Supabase: user accounts, saved analyses, history
- NextAuth authentication + admin role
- Stripe billing (Free / Pro $19 / Agency $49)
- Shareable analysis URLs
- PDF export
- GitHub → Vercel auto-deploy

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.local.example .env.local
# Edit .env.local and add your key:
# ANTHROPIC_API_KEY=sk-ant-...
```

Get your API key at: https://console.anthropic.com

### 3. Run locally
```bash
npm run dev
```

Open http://localhost:3000

### 4. Deploy to Vercel
```bash
npx vercel
# Add ANTHROPIC_API_KEY as environment variable in Vercel dashboard
```

## Project Structure
```
app/
  page.tsx          — Main analyzer UI
  layout.tsx        — Root layout + metadata (SEO)
  globals.css       — Design system, CSS variables
  api/
    analyze/
      route.ts      — Claude API endpoint

components/
  ResultsDisplay    — Aggregate score hero + section list
  SectionCard       — Collapsible section with description
  FactorRow         — Individual factor with score bar + explainers
  ScoreGauge        — SVG half-circle gauge

types/
  analysis.ts       — TypeScript interfaces
```

## Scoring Scale
- **0–3.5** → Likely Human (green)
- **3.5–6.5** → Ambiguous / Mixed (yellow)
- **6.5–10** → Likely AI-Generated (red)

## Score Weights
| Section | Weight |
|---|---|
| Cognitive Fingerprinting | 16% |
| Word Choice & Phrasing | 15% |
| Voice & Perspective | 14% |
| Content & Logic | 13% |
| Structure & Flow | 12% |
| Emotional Texture | 12% |
| Pragmatics & Subtext | 10% |
| Statistical Proxies | 8% |
