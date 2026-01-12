import { Request, Response } from 'express';
import * as drawingService from '../services/drawingService';

export async function getDrawing(req: Request, res: Response) {
  try {
    const { nodeId } = req.params;
    const drawing = await drawingService.getDrawingByNodeId(nodeId);
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }
    res.json(drawing);
  } catch (error) {
    console.error('Error getting drawing:', error);
    res.status(500).json({ error: 'Failed to get drawing' });
  }
}

export async function saveDrawing(req: Request, res: Response) {
  try {
    const { nodeId } = req.params;
    const { canvasData, thumbnailUrl } = req.body;

    if (!canvasData) {
      return res.status(400).json({ error: 'canvasData is required' });
    }

    const drawing = await drawingService.saveDrawing({
      flowNodeId: nodeId,
      canvasData,
      thumbnailUrl
    });
    res.json(drawing);
  } catch (error) {
    console.error('Error saving drawing:', error);
    res.status(500).json({ error: 'Failed to save drawing' });
  }
}

export async function deleteDrawing(req: Request, res: Response) {
  try {
    const { nodeId } = req.params;
    await drawingService.deleteDrawing(nodeId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting drawing:', error);
    res.status(500).json({ error: 'Failed to delete drawing' });
  }
}
