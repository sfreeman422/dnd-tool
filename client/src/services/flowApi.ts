import api from './api';
import type { FlowNode, FlowEdge } from '../types';

export interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export async function getFlowData(campaignId: string): Promise<FlowData> {
  const response = await api.get(`/flow/campaigns/${campaignId}`);
  return response.data;
}

export async function createNode(campaignId: string, data: {
  type: string;
  label: string;
  description?: string;
  positionX: number;
  positionY: number;
  encounterId?: string;
}): Promise<FlowNode> {
  const response = await api.post(`/flow/campaigns/${campaignId}/nodes`, data);
  return response.data;
}

export async function updateNode(nodeId: string, data: {
  type?: string;
  label?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  encounterId?: string | null;
}): Promise<FlowNode> {
  const response = await api.put(`/flow/nodes/${nodeId}`, data);
  return response.data;
}

export async function deleteNode(nodeId: string): Promise<void> {
  await api.delete(`/flow/nodes/${nodeId}`);
}

export async function createEdge(campaignId: string, data: {
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}): Promise<FlowEdge> {
  const response = await api.post(`/flow/campaigns/${campaignId}/edges`, data);
  return response.data;
}

export async function updateEdge(edgeId: string, data: {
  label?: string;
}): Promise<FlowEdge> {
  const response = await api.put(`/flow/edges/${edgeId}`, data);
  return response.data;
}

export async function deleteEdge(edgeId: string): Promise<void> {
  await api.delete(`/flow/edges/${edgeId}`);
}

export async function bulkUpdateNodes(campaignId: string, nodes: Array<{
  id: string;
  positionX: number;
  positionY: number;
}>): Promise<void> {
  await api.put(`/flow/campaigns/${campaignId}/bulk`, { nodes });
}
