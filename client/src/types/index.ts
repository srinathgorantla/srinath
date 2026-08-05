export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Farm {
  id: string;
  user_id?: string;
  name: string;
  size: number;
  soil_type: string;
  region: string;
  climate_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AIAdvisoryResponse {
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
  id: string;
  user_id?: string;
  farm_id: string;
  target_crop: string;
  budget: number;
  ai_response_json: AIAdvisoryResponse;
  created_at: string;
  farms?: Farm;
}

export interface AdvisoryInputPayload {
  farm_id: string;
  target_crop: string;
  budget: number;
}
