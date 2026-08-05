import { z } from 'zod';

// Farm Creation / Update Payload Validation Schema
export const createFarmSchema = z.object({
  name: z.string().min(2, 'Farm name must be at least 2 characters'),
  size: z.number().positive('Farm size must be greater than 0 acres'),
  soil_type: z.string().min(2, 'Soil type is required'),
  region: z.string().min(2, 'Region is required'),
  climate_notes: z.string().optional().default(''),
});

export const updateFarmSchema = createFarmSchema.partial();

// Advisory Generation Payload Validation Schema
export const createAdvisorySchema = z.object({
  farm_id: z.string().uuid('Invalid Farm ID format'),
  target_crop: z.string().min(2, 'Target crop is required'),
  budget: z.number().nonnegative('Budget must be a non-negative number'),
});

// Gemini AI JSON Output Validation Schema
export const aiAdvisoryResponseSchema = z.object({
  viabilityScore: z.number().min(0).max(100),
  executiveSummary: z.string().min(10),
  soilRecommendations: z.array(z.string()).min(1),
  pestControl: z.array(z.string()).min(1),
  irrigationPlan: z.string().min(10),
  financialBreakdown: z.object({
    estimatedCost: z.number(),
    projectedYieldIncrease: z.string(),
    roiMonths: z.number(),
  }).optional(),
  timeline: z.array(z.object({
    phase: z.string(),
    action: z.string(),
  })).optional(),
});

export type CreateFarmInput = z.infer<typeof createFarmSchema>;
export type CreateAdvisoryInput = z.infer<typeof createAdvisorySchema>;
export type AIAdvisoryResponse = z.infer<typeof aiAdvisoryResponseSchema>;
