import { Request, Response } from 'express';
import * as flowService from '../services/flowService';

export async function getFlowData(req: Request, res: Response) {
  try {
    const { campaignId } = req.params;
    const flowData = await flowService.getFlowData(campaignId);
    res.json(flowData);
  } catch (error) {
    console.error('Error getting flow data:', error);
    res.status(500).json({ error: 'Failed to get flow data' });
  }
}

export async function createNode(req: Request, res: Response) {
  try {
    const { campaignId } = req.params;
    const { type, label, description, positionX, positionY, encounterId } = req.body;

    if (!type || !label || positionX === undefined || positionY === undefined) {
      return res.status(400).json({ error: 'type, label, positionX, and positionY are required' });
    }

    const node = await flowService.createNode({
      campaignId,
      type,
      label,
      description,
      positionX,
      positionY,
      encounterId
    });
    res.status(201).json(node);
  } catch (error) {
    console.error('Error creating node:', error);
    res.status(500).json({ error: 'Failed to create node' });
  }
}

export async function updateNode(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { type, label, description, positionX, positionY, encounterId } = req.body;

    const node = await flowService.updateNode(id, {
      type,
      label,
      description,
      positionX,
      positionY,
      encounterId
    });
    res.json(node);
  } catch (error) {
    console.error('Error updating node:', error);
    res.status(500).json({ error: 'Failed to update node' });
  }
}

export async function deleteNode(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await flowService.deleteNode(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting node:', error);
    res.status(500).json({ error: 'Failed to delete node' });
  }
}

export async function createEdge(req: Request, res: Response) {
  try {
    const { campaignId } = req.params;
    const { sourceNodeId, targetNodeId, label } = req.body;

    if (!sourceNodeId || !targetNodeId) {
      return res.status(400).json({ error: 'sourceNodeId and targetNodeId are required' });
    }

    const edge = await flowService.createEdge({
      campaignId,
      sourceNodeId,
      targetNodeId,
      label
    });
    res.status(201).json(edge);
  } catch (error) {
    console.error('Error creating edge:', error);
    res.status(500).json({ error: 'Failed to create edge' });
  }
}

export async function updateEdge(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { label } = req.body;

    const edge = await flowService.updateEdge(id, { label });
    res.json(edge);
  } catch (error) {
    console.error('Error updating edge:', error);
    res.status(500).json({ error: 'Failed to update edge' });
  }
}

export async function deleteEdge(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await flowService.deleteEdge(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting edge:', error);
    res.status(500).json({ error: 'Failed to delete edge' });
  }
}

export async function bulkUpdateNodes(req: Request, res: Response) {
  try {
    const { campaignId } = req.params;
    const { nodes } = req.body;

    if (!Array.isArray(nodes)) {
      return res.status(400).json({ error: 'nodes must be an array' });
    }

    await flowService.bulkUpdateNodes(campaignId, nodes);
    res.json({ success: true });
  } catch (error) {
    console.error('Error bulk updating nodes:', error);
    res.status(500).json({ error: 'Failed to bulk update nodes' });
  }
}
