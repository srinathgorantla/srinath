import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface Farm {
  id?: string;
  user_id: string;
  name: string;
  size: number;
  soil_type: string;
  region: string;
  climate_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdvisoryRequestInput {
  farm_id: string;
  target_crop: string;
  budget: number;
}

export interface AdvisoryAIResponse {
  viabilityScore: number;
  executiveSummary: string;
  soilRecommendations: string[];
  pestControl: string[];
  irrigationPlan: string;
  financialBreakdown?: {
    estimatedCost: number;
    projectedYieldIncrease: string;
    roiMonths: number;
  };
  timeline?: {
    phase: string;
    action: string;
  }[];
}

export interface AdvisoryRecord {
  id?: string;
  user_id: string;
  farm_id: string;
  target_crop: string;
  budget: number;
  ai_response_json: AdvisoryAIResponse;
  created_at?: string;
}
