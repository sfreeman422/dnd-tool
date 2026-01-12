import { Router } from 'express';
import * as campaignController from '../controllers/campaignController';

const router = Router();

// GET /api/campaigns - List all campaigns
router.get('/', campaignController.getAllCampaigns);

// GET /api/campaigns/:id - Get campaign with flow data
router.get('/:id', campaignController.getCampaignById);

// POST /api/campaigns - Create new campaign
router.post('/', campaignController.createCampaign);

// PUT /api/campaigns/:id - Update campaign
router.put('/:id', campaignController.updateCampaign);

// DELETE /api/campaigns/:id - Delete campaign
router.delete('/:id', campaignController.deleteCampaign);

export default router;
