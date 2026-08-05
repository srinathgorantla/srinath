import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { isSupabaseConfigured, supabaseAdmin } from '../services/supabaseClient.js';

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In dev fallback mode if Supabase is not connected, allow mock user header or default test user
      if (!isSupabaseConfigured) {
        req.user = {
          id: (req.headers['x-mock-user-id'] as string) || 'demo-user-123456',
          email: 'demo.farmer@agriwise.ai',
          role: 'authenticated',
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid Bearer token header',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!isSupabaseConfigured || !supabaseAdmin) {
      // Dev mode fallback token decoding
      req.user = {
        id: 'demo-user-123456',
        email: 'demo.farmer@agriwise.ai',
        role: 'authenticated',
      };
      return next();
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid authentication session',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err: any) {
    console.error('[Auth Middleware Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Authentication middleware failure',
    });
  }
}
