# Debate Coach

An AI-powered debate training platform for students, debaters, MUN participants, public speakers, and competition participants.

## What is Debate Coach?

Debate Coach guides you through structured debate practice:

1. Enter a debate topic
2. Choose your position (FOR / AGAINST)
3. Choose difficulty and debate type
4. Receive AI-generated arguments, counterarguments, and rebuttals
5. Practice against an AI opponent
6. Receive a scored evaluation with detailed feedback

---

## Project Structure

```
debate-coach/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   ├── services/       # API service layer
│   │   ├── data/           # Static/mock data
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Node.js + Express backend
│   ├── src/
│   │   ├── routes/         # Express route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # AI service abstraction
│   │   ├── middleware/      # Error handling, validation
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── package.json            # Root scripts (concurrently)
├── .gitignore
└── README.md
```

---

## Requirements

- Node.js 18+
- npm 9+

---

## Installation

```bash
# From the project root
npm install
npm run install:all
```

---

## Development Commands

### Start both frontend and backend together:
```bash
npm run dev
```

### Start individually:
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Production build:
```bash
npm run build
```

---

## Local URLs

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:5173   |
| Backend  | http://localhost:5000   |

---

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` and fill in your values:

```bash
cp backend/.env.example backend/.env
```

| Variable      | Description                            | Required |
|---------------|----------------------------------------|----------|
| `PORT`        | Backend port (default: 5000)           | No       |
| `AI_API_KEY`  | Your AI provider API key               | No*      |
| `AI_BASE_URL` | OpenAI-compatible API base URL         | No*      |
| `AI_MODEL`    | Model name (e.g., gpt-4o-mini)         | No*      |
| `FRONTEND_URL`| Frontend URL for CORS                  | No       |

*If not set, the app runs in **Demo Mode**.

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## Demo Mode

**The application works without any AI API key.**

When `AI_API_KEY` is not configured:
- The backend returns realistic structured mock responses
- The full frontend UX works exactly as with real AI
- The health endpoint returns `"mode": "demo"`
- Demo-generated evidence is clearly labeled

This lets you test and develop the complete application before adding an AI key.

---

## AI Configuration

Debate Coach uses an OpenAI-compatible interface. You can use:

- **OpenAI**: Set `AI_BASE_URL=https://api.openai.com/v1`
- **OpenRouter**: Set `AI_BASE_URL=https://openrouter.ai/api/v1`
- **Groq**: Set `AI_BASE_URL=https://api.groq.com/openai/v1`
- **Ollama** (local): Set `AI_BASE_URL=http://localhost:11434/v1`
- Any other OpenAI-compatible provider

Example `backend/.env`:
```env
PORT=5000
AI_API_KEY=sk-your-key-here
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
FRONTEND_URL=http://localhost:5173
```

---

## Production Build

```bash
# Build frontend static files
npm run build

# The built files will be in frontend/dist/
# Serve with any static file host or configure Express to serve them
```

---

## Deployment Considerations

- Set all environment variables on your hosting platform
- Point `FRONTEND_URL` to your production domain for CORS
- Point `VITE_API_URL` to your production backend URL before building
- Never commit `.env` files
- The backend can serve the frontend `dist/` folder directly for single-server deployment

---

## Health Check

```
GET http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "service": "debate-coach-api",
  "mode": "demo"
}
```
`mode` will be `"ai"` when AI credentials are configured.
