import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import debateRoutes from './routes/debate.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

const isDev = process.env.NODE_ENV !== 'production';

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:4173', // vite preview
  'https://debate-coach-avadhgupta64-png.vercel.app',
  'https://debate-coach.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g., curl, Postman)
    if (!origin) return callback(null, true);
    // in dev, allow any localhost/127.0.0.1 origin regardless of port
    if (isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    // allow any vercel.app subdomain (covers preview deployments too)
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST'],
  credentials: false,
}));

app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api', debateRoutes);

// 404 and error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  const aiMode = process.env.AI_API_KEY ? 'AI' : 'DEMO';
  console.log(`\n🎯 Debate Coach API`);
  console.log(`   Listening on http://localhost:${PORT}`);
  console.log(`   Mode: ${aiMode}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
