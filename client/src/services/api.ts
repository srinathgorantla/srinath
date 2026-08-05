import { Farm, AdvisoryRecord, AdvisoryInputPayload } from '../types';
import { supabase, isSupabaseClientConfigured } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (isSupabaseClientConfigured) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
      return headers;
    }
  }

  // Fallback demo auth token header
  headers['Authorization'] = 'Bearer demo-mock-jwt-token';
  return headers;
}

export const api = {
  // Farms API
  async getFarms(): Promise<Farm[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/farms`, { headers });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch farms');
    return json.data;
  },

  async getFarmById(id: string): Promise<Farm> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/farms/${id}`, { headers });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch farm details');
    return json.data;
  },

  async createFarm(data: Omit<Farm, 'id'>): Promise<Farm> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/farms`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create farm profile');
    return json.data;
  },

  async updateFarm(id: string, data: Partial<Farm>): Promise<Farm> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/farms/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to update farm profile');
    return json.data;
  },

  async deleteFarm(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/farms/${id}`, {
      method: 'DELETE',
      headers,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete farm');
  },

  // Advisories API
  async getAdvisories(): Promise<AdvisoryRecord[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/advisories`, { headers });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch advisory history');
    return json.data;
  },

  async getAdvisoryById(id: string): Promise<AdvisoryRecord> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/advisories/${id}`, { headers });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch advisory report');
    return json.data;
  },

  async generateAdvisory(payload: AdvisoryInputPayload): Promise<AdvisoryRecord> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/advisories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to generate advisory report from Gemini AI');
    return json.data;
  },

  async deleteAdvisory(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/advisories/${id}`, {
      method: 'DELETE',
      headers,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete advisory');
  },
};
