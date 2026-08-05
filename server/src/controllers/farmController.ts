import { Response } from 'express';
import { AuthRequest, Farm } from '../types/index.js';
import { createFarmSchema, updateFarmSchema } from '../validators/schema.js';
import { isSupabaseConfigured, createUserSupabaseClient } from '../services/supabaseClient.js';

// In-memory store for fallback mode when Supabase is not connected
const mockFarmsStore: Map<string, Farm> = new Map([
  [
    'farm-demo-1',
    {
      id: 'farm-demo-1',
      user_id: 'demo-user-123456',
      name: 'Green Valley Agro Farm',
      size: 45,
      soil_type: 'Loam',
      region: 'Midwest Agriculture District',
      climate_notes: 'Temperate with seasonal rainfall (35-40 inches annual)',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ],
  [
    'farm-demo-2',
    {
      id: 'farm-demo-2',
      user_id: 'demo-user-123456',
      name: 'SunRidge Organic Acres',
      size: 20,
      soil_type: 'Clay',
      region: 'Southern Mediterranean Belt',
      climate_notes: 'Hot summers, mild winters with moderate coastal humidity',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
]);

export async function getFarms(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.json({ success: true, data });
    }
  }

  // Fallback mode logic
  const userFarms = Array.from(mockFarmsStore.values()).filter((f) => f.user_id === userId);
  return res.json({ success: true, data: userFarms });
}

export async function getFarmById(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const farmId = req.params.id;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('id', farmId)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, error: 'Farm record not found' });
      }
      return res.json({ success: true, data });
    }
  }

  // Fallback mode
  const farm = mockFarmsStore.get(farmId);
  if (!farm || farm.user_id !== userId) {
    return res.status(404).json({ success: false, error: 'Farm record not found' });
  }
  return res.json({ success: true, data: farm });
}

export async function createFarm(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const validation = createFarmSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.error.flatten(),
    });
  }

  const farmPayload = {
    ...validation.data,
    user_id: userId,
  };

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { data, error } = await supabase
        .from('farms')
        .insert([farmPayload])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.status(201).json({ success: true, data });
    }
  }

  // Fallback mode creation
  const newFarmId = `farm-${Date.now()}`;
  const newFarm: Farm = {
    id: newFarmId,
    ...farmPayload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockFarmsStore.set(newFarmId, newFarm);
  return res.status(201).json({ success: true, data: newFarm });
}

export async function updateFarm(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const farmId = req.params.id;
  const validation = updateFarmSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.error.flatten(),
    });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { data, error } = await supabase
        .from('farms')
        .update(validation.data)
        .eq('id', farmId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.json({ success: true, data });
    }
  }

  // Fallback update
  const existing = mockFarmsStore.get(farmId);
  if (!existing || existing.user_id !== userId) {
    return res.status(404).json({ success: false, error: 'Farm not found' });
  }

  const updatedFarm: Farm = {
    ...existing,
    ...validation.data,
    updated_at: new Date().toISOString(),
  };

  mockFarmsStore.set(farmId, updatedFarm);
  return res.json({ success: true, data: updatedFarm });
}

export async function deleteFarm(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const farmId = req.params.id;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (isSupabaseConfigured) {
    const supabase = createUserSupabaseClient(token);
    if (supabase) {
      const { error } = await supabase.from('farms').delete().eq('id', farmId);
      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.json({ success: true, message: 'Farm deleted successfully' });
    }
  }

  // Fallback delete
  const existing = mockFarmsStore.get(farmId);
  if (!existing || existing.user_id !== userId) {
    return res.status(404).json({ success: false, error: 'Farm not found' });
  }

  mockFarmsStore.delete(farmId);
  return res.json({ success: true, message: 'Farm deleted successfully' });
}
