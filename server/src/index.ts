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
app.use(helmet({
  contentSecurityPolicy: false, // Avoid blocking Vercel assets
}));
app.use(
  cors({
    origin: '*',
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

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: `API route ${req.method} ${req.url} not found` });
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

// Start standalone HTTP listener only when not running as a Vercel serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 AgriWise AI Express Backend running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Supabase Status: ${isSupabaseConfigured ? 'Active (Live)' : 'Fallback (Demo Mode)'}`);
    console.log(`🤖 Gemini AI Status: ${isGeminiConfigured ? 'Active (SDK)' : 'Fallback (Engine)'}`);
    console.log(`=======================================================`);
  });
}

export default app;
