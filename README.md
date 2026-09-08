# Debate Coach

An AI-powered debate training platform for students, MUN participants, public speakers, and competition debaters.

**Live site:** https://debate-coach-zeta.vercel.app/  
**Repository:** https://github.com/avadhgupta64-png/debate-coach  
**Founded & developed by:** Avadh Gupta

---

## What is Debate Coach?

Debate Coach guides you through a complete, structured training cycle:

1. Sign in with Google (or run in demo mode without any credentials)
2. Configure a debate topic, position (for/against), difficulty level, and debate format
3. Receive AI-generated preparation material — arguments, counterarguments, evidence, motion interpretation, key definitions, assumed weaknesses, opening/closing guidance, and overall strategy
4. Optionally refine your own arguments with an AI coaching session (feedback, not rewrites)
5. Practice in a live 5-round sparring session against an adaptive AI opponent
6. Request progressive hints when stuck — 3 levels: subtle → specific → step-by-step roadmap
7. Receive per-round evaluation: 6-dimension scores, model answer, fallacy detection, keyword suggestions
8. Get a final session report: 0–100 overall score, strongest/weakest moments, best argument, biggest missed opportunity, recommended next skill

---

## Features

### AI Training Engine
- OpenAI-compatible interface — works with OpenAI, OpenRouter, Groq, Ollama, or any compatible provider
- Default model: `gpt-4o-mini` (configurable via env var)
- Session diversity system: each run uses a different argument framework, stakeholder lens, and thematic angle to prevent repetitive responses
- Full demo mode: rich, pre-built mock responses returned when no AI API key is set

### Debate Preparation
- AI-generated arguments and counterarguments across multiple frameworks
- Evidence suggestions (labelled "Example — verify before using" to prevent fabricated data being presented as fact)
- Motion interpretation, key definitions, and strategic guidance
- Argument Refinement Coach: submit your own argument and receive structured coaching

### Live Sparring
- Adaptive AI opponent that reacts to what you actually wrote
- Never repeats the same challenge across a session
- Escalating pressure across 5 rounds
- Full conversation history sent with every evaluation request

### Hints System
- Level 1: subtle strategic nudge
- Level 2: specific argument direction
- Level 3: complete step-by-step response roadmap
- Hint usage tracked and factored into the final evaluation

### Evaluation and Scoring
- Per-round: 6-dimension scores (Logic, Evidence, Rebuttal, Clarity, Persuasiveness, Structure)
- Final report: 0–100 overall score, summary of strongest and weakest moments
- Logical fallacy detection across 10+ fallacy types, each labelled `definite` or `potential`

### Learn Section (public, no login required)
Free educational guides on debate fundamentals:

| Route | Topic |
|---|---|
| `/learn` | Hub overview with links to all guides |
| `/learn/arguments` | PEEL structure and four argument types (Empirical, Principled, Comparative, Consequentialist) |
| `/learn/rebuttals` | DARE framework and five rebuttal types |
| `/learn/fallacies` | Seven common logical fallacies with examples |
| `/learn/evidence` | Evidence evaluation and integration techniques |
| `/learn/preparation` | 30-minute brief framework for both sides |
| `/learn/techniques` | Ten beginner techniques with a weekly practice schedule |
| `/learn/mistakes` | Nine common mistakes (five major, four less obvious) |

Each Learn page has its own Open Graph tags, Twitter card metadata, and canonical URL for SEO.

### Authentication and Guest Mode
- Google Sign-In via Firebase Authentication (popup flow, `select_account` forced every time)
- Guests can browse the dashboard, history, and all Learn/public pages without signing in
- Action routes (`/setup`, `/preparation`, `/practice`, `/results`) prompt sign-in via modal
- Backend verifies Firebase ID tokens server-side; user identity is never taken from the request body

### PWA
- Service worker via Workbox 7
- Web app manifest, custom splash screen, and apple-touch-icon
- Splash shown once per day via `localStorage` timestamp gate

---

## Project Structure

```
debate-coach/
├── frontend/                   # React + Vite frontend
│   ├── public/                 # Static assets (favicon, OG image, manifest, ads.txt, sitemap)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ArgumentCard.jsx
│   │   │   ├── CoachCard.jsx
│   │   │   ├── EvidenceCard.jsx
│   │   │   ├── HeroCatapultAnimation.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MetaTags.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PositionBadge.jsx
│   │   │   ├── RotatingText.jsx
│   │   │   ├── RoundFeedback.jsx
│   │   │   ├── ScoreBar.jsx
│   │   │   ├── SignInModal.jsx
│   │   │   ├── SplashScreen.jsx
│   │   │   └── Toast.jsx
│   │   ├── config/             # Firebase client initialisation
│   │   ├── contexts/           # AuthContext, GuestContext
│   │   ├── data/               # Static/mock data
│   │   ├── hooks/              # useDebateSession, useDebateHistory, useDebateProfile, useDocumentTitle
│   │   ├── pages/
│   │   │   ├── learn/          # ArgumentsPage, RebuttalsPage, FallaciesPage, EvidencePage,
│   │   │   │                   #   PreparationPage, TechniquesPage, MistakesPage
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DebateProfile.jsx
│   │   │   ├── DebateSetup.jsx
│   │   │   ├── History.jsx
│   │   │   ├── LearnHub.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PracticeMode.jsx
│   │   │   ├── Preparation.jsx
│   │   │   ├── Privacy.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Terms.jsx
│   │   ├── services/           # api.js — all backend HTTP calls with Firebase JWT attachment
│   │   ├── App.jsx             # Routes, context providers, ProtectedRoute, SplashGate, footer
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html              # SEO meta tags, JSON-LD schema, AdSense
│   ├── package.json
│   ├── vite.config.js
│   ├── workbox.config.js
│   └── workbox.generator.mjs
│
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/             # Firebase Admin initialisation
│   │   ├── controllers/        # debateController.js — request handlers for all 7 endpoints
│   │   ├── middleware/         # auth.js, validate.js, errorHandler.js
│   │   ├── routes/             # debate.js — route definitions
│   │   ├── services/           # aiService.js — LLM calls and demo mode fallbacks
│   │   └── server.js           # Express app, CORS, route mounting
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root monorepo scripts (concurrently)
└── README.md
```

---

## Requirements

- Node.js 18+
- npm 9+
- A Firebase project with Google Sign-In enabled (see setup below) — optional for local dev

---

## Installation

```bash
# Install root dev tooling (concurrently)
npm install

# Install frontend and backend dependencies
npm run install:all
```

---

## Firebase Setup

Firebase is optional for local development. Without Firebase credentials the app runs in demo mode (see Demo Mode below).

### Step 1 — Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** and follow the wizard
3. Go to **Authentication → Sign-in method** and enable **Google**
4. Add your authorised domains (`localhost`, your production domain)

### Step 2 — Frontend Config

1. Go to **Project Settings → General → Your apps → Add app → Web**
2. Register the app (Firebase Hosting not required)
3. Copy the config values into `frontend/.env`:

```bash
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> These values are safe to expose in the frontend — they identify your app to Firebase but do not grant privileged access. Security is enforced by Firebase Authentication rules.

### Step 3 — Backend Service Account

1. Go to **Project Settings → Service accounts → Generate new private key**
2. Download the JSON and add the values to `backend/.env`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
```

> The `FIREBASE_PRIVATE_KEY` must preserve the literal `\n` newline characters exactly as downloaded. Never commit this value.

---

## Environment Variables

### Backend (`backend/.env`)

```bash
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Firebase Admin SDK — all three required for auth enforcement
# Omit all three to run in auth-bypass demo mode
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# AI Provider — leave AI_API_KEY blank to return mock responses
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

### Frontend (`frontend/.env`)

```bash
# Backend API URL
VITE_API_URL=http://localhost:5000

# Firebase client config
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Demo Mode

The application works fully without any credentials.

**No Firebase credentials (all three `FIREBASE_*` backend vars omitted):**
- Auth middleware skips token verification and attaches a `demo-user` identity
- All debate features work normally
- Useful for local development without a service account

**No AI credentials (`AI_API_KEY` blank or unset):**
- Backend returns rich pre-built mock responses instead of calling an LLM
- Four argument-set variants, three opening/closing variants, three strategy variants — randomised per session using a topic hash + timestamp bucket so responses are not identical across runs
- Full frontend UX is functional end-to-end
- Health endpoint reports `"mode": "demo"`

---

## AI Provider Support

Debate Coach uses the OpenAI Node.js SDK with a configurable base URL, making it compatible with any OpenAI-compatible provider.

| Provider | `AI_BASE_URL` |
|---|---|
| OpenAI | `https://api.openai.com/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| Ollama (local) | `http://localhost:11434/v1` |
| Any OpenAI-compatible | Set your base URL |

---

## Development

```bash
# Start frontend and backend together
npm run dev

# Start individually
npm run dev:backend
npm run dev:frontend
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## Build

```bash
# Production build (Vite + Workbox service worker generation)
npm run build
```

Output is written to `frontend/dist/`.

---

## API Endpoints

All endpoints are served under `/api`. The backend request body limit is 10 KB.

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Health check — returns `status`, `mode`, `timestamp` |
| `POST` | `/api/debate/generate` | Required | Generate full debate preparation material |
| `POST` | `/api/debate/challenge` | Required | Get next AI sparring challenge |
| `POST` | `/api/debate/evaluate` | Required | Evaluate a round response |
| `POST` | `/api/debate/complete` | Required | Final session evaluation and overall score |
| `POST` | `/api/debate/refine` | Required | Argument coaching feedback |
| `POST` | `/api/debate/hint` | Required | Progressive hint (level 1, 2, or 3) |

### Authentication Header

All protected endpoints require a valid Firebase ID token:

```
Authorization: Bearer <Firebase ID Token>
```

The backend verifies this with Firebase Admin SDK and extracts `req.user`. User identity is never taken from the request body.

### Health Check Example

```bash
curl http://localhost:5000/api/health
```

```json
{
  "status": "ok",
  "service": "debate-coach-api",
  "mode": "ai",
  "timestamp": "2026-09-08T00:00:00.000Z"
}
```

`mode` is `"ai"` when an AI API key is configured, `"demo"` otherwise.

---

## Frontend Routes

| Path | Page | Auth required |
|---|---|---|
| `/` | Dashboard | Guest-accessible |
| `/login` | Login | Public |
| `/setup` | Debate setup | Sign-in required |
| `/preparation` | AI preparation + argument coaching | Sign-in required |
| `/practice` | Live 5-round sparring | Sign-in required |
| `/results` | Final session evaluation | Sign-in required |
| `/history` | Past debate records | Guest-accessible |
| `/profile` | User stats and profile | Sign-in required |
| `/learn` | Learn section hub | Public |
| `/learn/arguments` | Building arguments (PEEL) | Public |
| `/learn/rebuttals` | Delivering rebuttals (DARE) | Public |
| `/learn/fallacies` | Logical fallacies | Public |
| `/learn/evidence` | Using evidence effectively | Public |
| `/learn/preparation` | 30-minute brief framework | Public |
| `/learn/techniques` | Ten beginner techniques | Public |
| `/learn/mistakes` | Common debate mistakes | Public |
| `/about` | About the project | Public |
| `/resources` | External debate resources | Public |
| `/privacy` | Privacy policy | Public |
| `/terms` | Terms of service | Public |
| `/contact` | Contact | Public |

---

## Deployment

### Frontend — Vercel

1. Run `npm run build` (produces `frontend/dist/`)
2. Deploy the `frontend/` directory to Vercel (output dir: `dist`)
3. Set all `VITE_*` environment variables in the Vercel dashboard
4. Add your Vercel domain to Firebase Console → Authentication → Authorised domains

### Backend — Render or Railway

1. Deploy the `backend/` directory
2. Set `PORT`, `FRONTEND_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`
3. Set `VITE_API_URL` in the frontend environment to point to the deployed backend URL

The CORS configuration allows any `*.vercel.app` subdomain in production and any `localhost` origin in development.

---

## Security Notes

- `FIREBASE_PRIVATE_KEY` and `AI_API_KEY` are server-side only — never sent to the browser
- Frontend Firebase config is public by design (required for the client SDK; access is gated by Firebase Authentication rules)
- User identity is always derived from the verified JWT, never from `req.body.userId`
- All AI inputs are validated and length-limited before being forwarded to the provider
- All AI-generated evidence is labelled "Example — verify before using" to prevent fabricated citations being presented as fact

---

## Contact

Avadh Gupta — founder and developer  
GitHub: [avadhgupta64-png](https://github.com/avadhgupta64-png)  
Repository: [github.com/avadhgupta64-png/debate-coach](https://github.com/avadhgupta64-png/debate-coach)  
Live site: [debate-coach-zeta.vercel.app](https://debate-coach-zeta.vercel.app/)
