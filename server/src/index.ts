import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import farmRoutes from './routes/farmRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import { isSupabaseConfigured } from './services/supabaseClient.js';
import { isGeminiConfigured } from './services/geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());

// API Status & Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AgriWise AI Backend API',
    timestamp: new Date().toISOString(),
    services: {
      supabase: isSupabaseConfigured ? 'connected' : 'fallback-demo-mode',
      geminiAI: isGeminiConfigured ? 'connected' : 'fallback-agronomy-engine',
    },
  });
});

// API Routes
app.use('/api/farms', farmRoutes);
app.use('/api/advisories', advisoryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Global Express Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AgriWise AI Express Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Supabase Status: ${isSupabaseConfigured ? 'Active (Live)' : 'Fallback (Demo Mode)'}`);
  console.log(`🤖 Gemini AI Status: ${isGeminiConfigured ? 'Active (SDK)' : 'Fallback (Engine)'}`);
  console.log(`=======================================================`);
});

export default app;
