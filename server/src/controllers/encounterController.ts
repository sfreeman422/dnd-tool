import { Request, Response } from 'express';
import * as encounterService from '../services/encounterService';

export async function getEncounterById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const encounter = await encounterService.getEncounterById(id);
    if (!encounter) {
      return res.status(404).json({ error: 'Encounter not found' });
    }
    res.json(encounter);
  } catch (error) {
    console.error('Error getting encounter:', error);
    res.status(500).json({ error: 'Failed to get encounter' });
  }
}

export async function createEncounter(req: Request, res: Response) {
  try {
    const { campaignId } = req.params;
    const { name, storyText, dmNotes, spotifyTrackUri } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const encounter = await encounterService.createEncounter({
      campaignId,
      name,
      storyText,
      dmNotes,
      spotifyTrackUri
    });
    res.status(201).json(encounter);
  } catch (error) {
    console.error('Error creating encounter:', error);
    res.status(500).json({ error: 'Failed to create encounter' });
  }
}

export async function updateEncounter(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, storyText, dmNotes, spotifyTrackUri } = req.body;

    const encounter = await encounterService.updateEncounter(id, {
      name,
      storyText,
      dmNotes,
      spotifyTrackUri
    });
    res.json(encounter);
  } catch (error) {
    console.error('Error updating encounter:', error);
    res.status(500).json({ error: 'Failed to update encounter' });
  }
}

export async function deleteEncounter(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await encounterService.deleteEncounter(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting encounter:', error);
    res.status(500).json({ error: 'Failed to delete encounter' });
  }
}

// Enemy handlers
export async function addEnemy(req: Request, res: Response) {
  try {
    const { encounterId } = req.params;
    const { name, hitPoints, armorClass, challenge, abilities, imageUrl } = req.body;

    if (!name || hitPoints === undefined || armorClass === undefined || !challenge) {
      return res.status(400).json({ error: 'name, hitPoints, armorClass, and challenge are required' });
    }

    const enemy = await encounterService.addEnemy({
      encounterId,
      name,
      hitPoints,
      armorClass,
      challenge,
      abilities,
      imageUrl
    });
    res.status(201).json(enemy);
  } catch (error) {
    console.error('Error adding enemy:', error);
    res.status(500).json({ error: 'Failed to add enemy' });
  }
}

export async function updateEnemy(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, hitPoints, armorClass, challenge, abilities, imageUrl } = req.body;

    const enemy = await encounterService.updateEnemy(id, {
      name,
      hitPoints,
      armorClass,
      challenge,
      abilities,
      imageUrl
    });
    res.json(enemy);
  } catch (error) {
    console.error('Error updating enemy:', error);
    res.status(500).json({ error: 'Failed to update enemy' });
  }
}

export async function deleteEnemy(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await encounterService.deleteEnemy(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting enemy:', error);
    res.status(500).json({ error: 'Failed to delete enemy' });
  }
}

// Loot handlers
export async function addLoot(req: Request, res: Response) {
  try {
    const { encounterId } = req.params;
    const { name, description, quantity, rarity } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const loot = await encounterService.addLoot({
      encounterId,
      name,
      description,
      quantity,
      rarity
    });
    res.status(201).json(loot);
  } catch (error) {
    console.error('Error adding loot:', error);
    res.status(500).json({ error: 'Failed to add loot' });
  }
}

export async function updateLoot(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, quantity, rarity } = req.body;

    const loot = await encounterService.updateLoot(id, {
      name,
      description,
      quantity,
      rarity
    });
    res.json(loot);
  } catch (error) {
    console.error('Error updating loot:', error);
    res.status(500).json({ error: 'Failed to update loot' });
  }
}

export async function deleteLoot(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await encounterService.deleteLoot(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting loot:', error);
    res.status(500).json({ error: 'Failed to delete loot' });
  }
}
