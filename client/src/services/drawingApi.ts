import api from './api';
import type { Drawing } from '../types';

export async function getDrawing(nodeId: string): Promise<Drawing> {
  const response = await api.get(`/drawings/nodes/${nodeId}`);
  return response.data;
}

export async function saveDrawing(nodeId: string, data: {
  canvasData: string;
  thumbnailUrl?: string;
}): Promise<Drawing> {
  const response = await api.post(`/drawings/nodes/${nodeId}`, data);
  return response.data;
}

export async function deleteDrawing(nodeId: string): Promise<void> {
  await api.delete(`/drawings/nodes/${nodeId}`);
}
