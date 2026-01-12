import { Router } from 'express';
import * as flowController from '../controllers/flowController';

const router = Router();

// GET /api/flow/campaigns/:campaignId - Get all nodes and edges for a campaign
router.get('/campaigns/:campaignId', flowController.getFlowData);

// POST /api/flow/campaigns/:campaignId/nodes - Create new node
router.post('/campaigns/:campaignId/nodes', flowController.createNode);

// PUT /api/flow/nodes/:id - Update node
router.put('/nodes/:id', flowController.updateNode);

// DELETE /api/flow/nodes/:id - Delete node
router.delete('/nodes/:id', flowController.deleteNode);

// POST /api/flow/campaigns/:campaignId/edges - Create new edge
router.post('/campaigns/:campaignId/edges', flowController.createEdge);

// PUT /api/flow/edges/:id - Update edge
router.put('/edges/:id', flowController.updateEdge);

// DELETE /api/flow/edges/:id - Delete edge
router.delete('/edges/:id', flowController.deleteEdge);

// PUT /api/flow/campaigns/:campaignId/bulk - Bulk update nodes (for drag operations)
router.put('/campaigns/:campaignId/bulk', flowController.bulkUpdateNodes);

export default router;
