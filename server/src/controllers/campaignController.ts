import { Request, Response } from 'express';
import * as campaignService from '../services/campaignService';

export async function getAllCampaigns(req: Request, res: Response) {
  try {
    const campaigns = await campaignService.getAllCampaigns();
    res.json(campaigns);
  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({ error: 'Failed to get campaigns' });
  }
}

export async function getCampaignById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const campaign = await campaignService.getCampaignById(id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error getting campaign:', error);
    res.status(500).json({ error: 'Failed to get campaign' });
  }
}

export async function createCampaign(req: Request, res: Response) {
  try {
    const { name, description, spotifyPlaylistId } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const campaign = await campaignService.createCampaign({
      name,
      description,
      spotifyPlaylistId
    });
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
}

export async function updateCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, spotifyPlaylistId } = req.body;
    const campaign = await campaignService.updateCampaign(id, {
      name,
      description,
      spotifyPlaylistId
    });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
}

export async function deleteCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await campaignService.deleteCampaign(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
}
