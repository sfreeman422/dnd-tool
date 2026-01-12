import api from './api';
import type { Encounter, Enemy, Loot } from '../types';

export async function getEncounter(id: string): Promise<Encounter> {
  const response = await api.get(`/encounters/${id}`);
  return response.data;
}

export async function createEncounter(campaignId: string, data: {
  name: string;
  storyText?: string;
  dmNotes?: string;
  spotifyTrackUri?: string;
}): Promise<Encounter> {
  const response = await api.post(`/encounters/campaigns/${campaignId}`, data);
  return response.data;
}

export async function updateEncounter(id: string, data: {
  name?: string;
  storyText?: string;
  dmNotes?: string;
  spotifyTrackUri?: string;
}): Promise<Encounter> {
  const response = await api.put(`/encounters/${id}`, data);
  return response.data;
}

export async function deleteEncounter(id: string): Promise<void> {
  await api.delete(`/encounters/${id}`);
}

// Enemy operations
export async function addEnemy(encounterId: string, data: {
  name: string;
  hitPoints: number;
  armorClass: number;
  challenge: string;
  abilities?: string;
  imageUrl?: string;
}): Promise<Enemy> {
  const response = await api.post(`/encounters/${encounterId}/enemies`, data);
  return response.data;
}

export async function updateEnemy(id: string, data: {
  name?: string;
  hitPoints?: number;
  armorClass?: number;
  challenge?: string;
  abilities?: string;
  imageUrl?: string;
}): Promise<Enemy> {
  const response = await api.put(`/encounters/enemies/${id}`, data);
  return response.data;
}

export async function deleteEnemy(id: string): Promise<void> {
  await api.delete(`/encounters/enemies/${id}`);
}

// Loot operations
export async function addLoot(encounterId: string, data: {
  name: string;
  description?: string;
  quantity?: number;
  rarity?: string;
}): Promise<Loot> {
  const response = await api.post(`/encounters/${encounterId}/loot`, data);
  return response.data;
}

export async function updateLoot(id: string, data: {
  name?: string;
  description?: string;
  quantity?: number;
  rarity?: string;
}): Promise<Loot> {
  const response = await api.put(`/encounters/loot/${id}`, data);
  return response.data;
}

export async function deleteLoot(id: string): Promise<void> {
  await api.delete(`/encounters/loot/${id}`);
}
