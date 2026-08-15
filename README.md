# Debate Coach

An AI-powered debate training platform for students, debaters, MUN participants, public speakers, and competition participants.

## What is Debate Coach?

Debate Coach guides you through a complete structured debate training experience:

1. Sign in with Google
2. Enter a debate topic and configure your session
3. Receive AI-generated preparation material (arguments, counterarguments, strategy, evidence)
4. Optionally refine your own arguments with AI coaching
5. Practice in a live 5-round sparring session against an AI opponent
6. Use progressive hints when stuck (3 levels: subtle → specific → strong)
7. Receive per-round scoring and a model answer after each round
8. Get a detailed final report: 0–100 scoring, logical fallacy detection, strongest/weakest moments

---

## Project Structure

```
debate-coach/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── config/         # Firebase client config
│   │   ├── contexts/       # AuthContext (Firebase Auth state)
│   │   ├── pages/          # Route-level page components
│   │   ├── services/       # API service layer (with auth headers)
│   │   ├── data/           # Static/mock data
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.jsx         # App root + context providers
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Firebase Admin config
│   │   ├── routes/         # Express route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # AI service (OpenAI-compatible)
│   │   └── middleware/     # Auth, validation, error handling
│   ├── .env.example
│   └── package.json
│
├── package.json            # Root scripts (concurrently)
└── README.md
```

---

## Requirements

- Node.js 18+
- npm 9+
- A Firebase project with Google Sign-In enabled (see setup below)

---

## Installation

```bash
npm install
npm run install:all
```

---

## Firebase Setup (Required for Authentication)

### Step 1 — Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** and follow the wizard
3. Once created, go to **Authentication → Sign-in method**
4. Enable **Google** as a sign-in provider
5. Add your authorised domains (e.g. `localhost`, your production domain)

### Step 2 — Get Frontend Config

1. In Firebase Console, go to **Project Settings → General**
2. Scroll to **Your apps** and click **Add app → Web**
3. Register the app (no Firebase Hosting required)
4. Copy the config object values into `frontend/.env`:

```bash
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> These values are safe to expose in the frontend — they identify your app to Firebase but do not grant any special access. Security is enforced by Firebase Authentication rules.

### Step 3 — Get Backend Service Account

1. In Firebase Console, go to **Project Settings → Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Add values to `backend/.env`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
```

> ⚠️ Keep the `FIREBASE_PRIVATE_KEY` exactly as downloaded. The `\n` newlines must be preserved. Never commit this file.

---

## Environment Variables

### Backend (`backend/.env`)

```bash
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Firebase Admin (required for authentication enforcement)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# AI Provider (leave blank for demo mode)
AI_API_KEY=sk-or-v1-...
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=gpt-4o-mini
```

### Frontend (`frontend/.env`)

```bash
VITE_API_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Demo Mode

The application works fully without any credentials configured.

**Without Firebase credentials:**
- Authentication middleware bypasses token verification with a demo user
- All AI/debate features work normally
- Useful for local development and testing

**Without AI credentials (`AI_API_KEY` not set):**
- Backend returns structured realistic mock responses
- Full frontend UX is functional
- Health endpoint shows `"mode": "demo"`

---

## AI Provider Support

Debate Coach uses an OpenAI-compatible interface. Supported providers:

| Provider | `AI_BASE_URL` |
|----------|---------------|
| OpenAI | `https://api.openai.com/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| Ollama (local) | `http://localhost:11434/v1` |
| Any OpenAI-compatible | Set your base URL |

---

## Development

```bash
# Start both frontend and backend together
npm run dev

# Start individually
npm run dev:backend
npm run dev:frontend

# Production build
npm run build
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | Public | Health check, returns mode |
| `POST` | `/api/debate/generate` | Required | Generate debate preparation |
| `POST` | `/api/debate/challenge` | Required | AI sparring challenge |
| `POST` | `/api/debate/evaluate` | Required | Evaluate a round response |
| `POST` | `/api/debate/complete` | Required | Final session evaluation |
| `POST` | `/api/debate/refine` | Required | Argument refinement coaching |
| `POST` | `/api/debate/hint` | Required | Progressive hint (level 1-3) |

### Authentication

All protected endpoints require:

```
Authorization: Bearer <Firebase ID Token>
```

The backend verifies this token with Firebase Admin SDK and extracts `req.user.uid`. User identity is never taken from the request body or query parameters.

---

## Security Notes

- Firebase Admin private key is **server-side only** — never exposed to the browser
- AI API key is **server-side only** — never exposed to the browser
- Frontend Firebase config is public by design (required for client SDK)
- User identity is always derived from the verified JWT, never from `req.body.userId`
- All AI inputs are validated and length-limited before processing
- CORS allows localhost in dev and `*.vercel.app` in production

---

## New in Phase 1

### Authentication
- Google Sign-In via Firebase Authentication
- Persistent sessions across browser refreshes
- User name and profile photo in Navbar
- Protected routes (redirect to `/login` when unauthenticated)
- Server-side token verification on all AI endpoints

### Enhanced Preparation
- Motion interpretation and key definitions
- Explicit assumptions your side is making
- Potential weaknesses in your position
- Opening and closing argument guidance
- Overall debate strategy guidance
- Collapsible sections for easier navigation

### Argument Refinement Coach
- Write your own argument and get AI coaching
- Feedback: strengths, weaknesses, missing evidence, logical problems
- Structural improvement suggestions
- Coaching hints (prompts, not rewrites)
- Iterative: refine → analyse → refine again

### Live AI Sparring
- Adaptive AI opponent that reacts to what you actually said
- Never repeats challenges
- Escalates pressure across rounds
- Full conversation history sent with every evaluation

### Progressive Hints
- "Need a Hint?" button with 3 levels
- Level 1: subtle strategic guidance
- Level 2: specific argument direction
- Level 3: step-by-step response roadmap
- Hint usage tracked and included in evaluation context

### Post-Debate Analysis
- 0–100 scoring across 6 dimensions: Logic, Evidence, Rebuttal, Clarity, Persuasiveness, Structure
- Strongest moment, weakest moment, best argument, biggest missed opportunity
- Recommended next skill to practise
- Logical fallacy detection (10+ fallacy types) with confidence labels

---

## Deployment

### Frontend (Vercel)
1. Build: `npm run build`
2. Deploy `frontend/dist/` to Vercel
3. Set `VITE_*` environment variables in Vercel dashboard
4. Add your Vercel domain to Firebase Console → Authentication → Authorised domains

### Backend (Render / Railway)
1. Deploy the `backend/` directory
2. Set `PORT`, `FRONTEND_URL`, `FIREBASE_*`, and `AI_*` environment variables
3. Update `VITE_API_URL` in your frontend `.env` to point to the backend URL

---

## Health Check

```
GET http://localhost:5000/api/health
```

```json
{
  "status": "ok",
  "service": "debate-coach-api",
  "mode": "ai",
  "timestamp": "2026-08-15T00:00:00.000Z"
}
```

`mode` is `"ai"` when AI credentials are set, `"demo"` otherwise.
