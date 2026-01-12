import { Router } from 'express';
import * as drawingController from '../controllers/drawingController';

const router = Router();

// GET /api/drawings/nodes/:nodeId - Get drawing for a node
router.get('/nodes/:nodeId', drawingController.getDrawing);

// POST /api/drawings/nodes/:nodeId - Create/update drawing
router.post('/nodes/:nodeId', drawingController.saveDrawing);

// DELETE /api/drawings/nodes/:nodeId - Delete drawing
router.delete('/nodes/:nodeId', drawingController.deleteDrawing);

export default router;
