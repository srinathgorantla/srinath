import { Response } from 'express';
import { AuthRequest, AdvisoryRecord, Farm } from '../types/index.js';
import { createAdvisorySchema } from '../validators/schema.js';
import { generateAgronomicAdvisory } from '../services/geminiService.js';
import { isSupabaseConfigured, createUserSupabaseClient } from '../services/supabaseClient.js';

// Fallback in-memory advisory store
const mockAdvisoriesStore: Map<string, AdvisoryRecord> = new Map([
  [
    'adv-demo-1',
    {
      id: 'adv-demo-1',
      user_id: 'demo-user-123456',
      farm_id: 'farm-demo-1',
      target_crop: 'Yellow Corn (Zea mays)',
      budget: 12500,
      ai_response_json: {
        viabilityScore: 89,
        executiveSummary: 'Targeting Yellow Corn on 45 acres of Loam soil in Midwest Agriculture District (Green Valley Agro Farm) is highly feasible with a total budget of $12,500. Implementing precision soil conditioning, sub-surface drip irrigation, and an organic Integrated Pest Management regime will optimize yields while conserving capital.',
        soilRecommendations: [
          'Apply organic compost at 2.5 tons/acre during ground prep to enhance soil organic matter.',
          'Incorporate elemental sulfur to regulate soil pH to optimum range of 6.2 - 6.8 for nitrogen uptake.',
          'Inject Mycorrhizal fungi inoculation at seed planting to expand root surface area.'
        ],
        pestControl: [
          'Deploy pheromone traps early in season for monitoring corn borer moths.',
          'Schedule bi-weekly foliar sprays of Bacillus thuringiensis (Bt) during knee-high growth stage.',
          'Establish 5-meter marigold border strips for beneficial predatory insects.'
        ],
        irrigationPlan: 'Utilize sub-surface drip lines running at 0.45 GPH per emitter. Execute 45-minute daily early morning watering cycles (4:00 AM - 6:00 AM) based on tensiometer readings.',
        financialBreakdown: {
          estimatedCost: 11000,
          projectedYieldIncrease: '+32% bushels per acre',
          roiMonths: 6
        },
        timeline: [
          { phase: 'Pre-Planting (Weeks 1-2)', action: 'Deep till soil, apply mycorrhizal fungi and set up drip irrigation.' },
          { phase: 'Germination (Weeks 3-4)', action: 'Precision seed drilling with in-furrow bio-stimulant booster.' },
          { phase: 'Vegetative (Weeks 5-9)', action: 'Nitrogen fertigation cycles and pest scouting.' },
          { phase: 'Harvest (Weeks 10-14)', action: 'Yield moisture testing and combine harvesting.' }
        ]
      },
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ]
]);

export async function getAdvisories(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { data, error } = await supabase
        .from('advisories')
        .select(`
          *,
          farms:farm_id (id, name, size, soil_type, region)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.json({ success: true, data });
    }
  }

  // Fallback mode
  const list = Array.from(mockAdvisoriesStore.values()).filter((a) => a.user_id === userId);
  return res.json({ success: true, data: list });
}

export async function getAdvisoryById(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const advisoryId = req.params.id;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { data, error } = await supabase
        .from('advisories')
        .select(`
          *,
          farms:farm_id (id, name, size, soil_type, region, climate_notes)
        `)
        .eq('id', advisoryId)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, error: 'Advisory report not found' });
      }
      return res.json({ success: true, data });
    }
  }

  // Fallback mode
  const adv = mockAdvisoriesStore.get(advisoryId);
  if (!adv || adv.user_id !== userId) {
    return res.status(404).json({ success: false, error: 'Advisory report not found' });
  }
  return res.json({ success: true, data: adv });
}

export async function createAdvisory(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const validation = createAdvisorySchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.error.flatten(),
    });
  }

  const { farm_id, target_crop, budget } = validation.data;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  let farmData: Farm | null = null;

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { data: farm, error: farmErr } = await supabase
        .from('farms')
        .select('*')
        .eq('id', farm_id)
        .single();

      if (farmErr || !farm) {
        return res.status(404).json({ success: false, error: 'Associated Farm profile not found' });
      }
      farmData = farm;
    }
  }

  // Fallback farm retrieval if not found via Supabase
  if (!farmData) {
    farmData = {
      id: farm_id,
      user_id: userId,
      name: 'AgriWise Demo Farm',
      size: 35,
      soil_type: 'Loam',
      region: 'Central Valley Agriculture District',
      climate_notes: 'Moderate Mediterranean climate with dry summers',
    };
  }

  try {
    // Call Gemini AI Service
    const aiResponse = await generateAgronomicAdvisory({
      farmName: farmData.name,
      size: farmData.size,
      soilType: farmData.soil_type,
      region: farmData.region,
      climateNotes: farmData.climate_notes,
      targetCrop: target_crop,
      budget: budget,
    });

    const advisoryPayload = {
      user_id: userId,
      farm_id: farm_id,
      target_crop: target_crop,
      budget: budget,
      ai_response_json: aiResponse,
    };

    if (isSupabaseConfigured) {
      const supabase = createUserSupabaseClient(token);
      if (supabase) {
        const { data: inserted, error: insertErr } = await supabase
          .from('advisories')
          .insert([advisoryPayload])
          .select(`
            *,
            farms:farm_id (id, name, size, soil_type, region)
          `)
          .single();

        if (insertErr) {
          return res.status(400).json({ success: false, error: insertErr.message });
        }
        return res.status(201).json({ success: true, data: inserted });
      }
    }

    // Fallback store insert
    const newAdvisoryId = `adv-${Date.now()}`;
    const newAdvisoryRecord: AdvisoryRecord = {
      id: newAdvisoryId,
      ...advisoryPayload,
      created_at: new Date().toISOString(),
    };

    mockAdvisoriesStore.set(newAdvisoryId, newAdvisoryRecord);
    return res.status(201).json({ success: true, data: { ...newAdvisoryRecord, farms: farmData } });

  } catch (error: any) {
    console.error('[Create Advisory Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate advisory report from Gemini AI service',
      details: error.message,
    });
  }
}

export async function deleteAdvisory(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const advisoryId = req.params.id;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { error } = await supabase.from('advisories').delete().eq('id', advisoryId);
      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.json({ success: true, message: 'Advisory report deleted' });
    }
  }

  // Fallback delete
  const existing = mockAdvisoriesStore.get(advisoryId);
  if (!existing || existing.user_id !== userId) {
    return res.status(404).json({ success: false, error: 'Advisory not found' });
  }

  mockAdvisoriesStore.delete(advisoryId);
  return res.json({ success: true, message: 'Advisory report deleted' });
}
