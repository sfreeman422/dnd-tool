import api from './api';
import type { Campaign } from '../types';

export async function getCampaigns(): Promise<Campaign[]> {
  const response = await api.get('/campaigns');
  return response.data;
}

export async function getCampaign(id: string): Promise<Campaign> {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
}

export async function createCampaign(data: {
  name: string;
  description?: string;
  spotifyPlaylistId?: string;
}): Promise<Campaign> {
  const response = await api.post('/campaigns', data);
  return response.data;
}

export async function updateCampaign(id: string, data: {
  name?: string;
  description?: string;
  spotifyPlaylistId?: string;
}): Promise<Campaign> {
  const response = await api.put(`/campaigns/${id}`, data);
  return response.data;
}

export async function deleteCampaign(id: string): Promise<void> {
  await api.delete(`/campaigns/${id}`);
}
