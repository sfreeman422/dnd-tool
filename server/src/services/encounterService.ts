import { prisma } from '../config/database';

export async function getEncounterById(id: string) {
  return prisma.encounter.findUnique({
    where: { id },
    include: {
      enemies: true,
      loot: true,
      flowNode: true
    }
  });
}

export async function createEncounter(data: {
  campaignId: string;
  name: string;
  storyText?: string;
  dmNotes?: string;
  spotifyTrackUri?: string;
}) {
  return prisma.encounter.create({
    data: {
      campaignId: data.campaignId,
      name: data.name,
      storyText: data.storyText || '',
      dmNotes: data.dmNotes || '',
      spotifyTrackUri: data.spotifyTrackUri
    },
    include: {
      enemies: true,
      loot: true
    }
  });
}

export async function updateEncounter(id: string, data: {
  name?: string;
  storyText?: string;
  dmNotes?: string;
  spotifyTrackUri?: string;
}) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.storyText !== undefined) updateData.storyText = data.storyText;
  if (data.dmNotes !== undefined) updateData.dmNotes = data.dmNotes;
  if (data.spotifyTrackUri !== undefined) updateData.spotifyTrackUri = data.spotifyTrackUri;

  return prisma.encounter.update({
    where: { id },
    data: updateData,
    include: {
      enemies: true,
      loot: true
    }
  });
}

export async function deleteEncounter(id: string) {
  return prisma.encounter.delete({
    where: { id }
  });
}

// Enemy operations
export async function addEnemy(data: {
  encounterId: string;
  name: string;
  hitPoints: number;
  armorClass: number;
  challenge: string;
  abilities?: string;
  imageUrl?: string;
}) {
  return prisma.enemy.create({
    data: {
      encounterId: data.encounterId,
      name: data.name,
      hitPoints: data.hitPoints,
      armorClass: data.armorClass,
      challenge: data.challenge,
      abilities: data.abilities || '',
      imageUrl: data.imageUrl
    }
  });
}

export async function updateEnemy(id: string, data: {
  name?: string;
  hitPoints?: number;
  armorClass?: number;
  challenge?: string;
  abilities?: string;
  imageUrl?: string;
}) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.hitPoints !== undefined) updateData.hitPoints = data.hitPoints;
  if (data.armorClass !== undefined) updateData.armorClass = data.armorClass;
  if (data.challenge !== undefined) updateData.challenge = data.challenge;
  if (data.abilities !== undefined) updateData.abilities = data.abilities;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

  return prisma.enemy.update({
    where: { id },
    data: updateData
  });
}

export async function deleteEnemy(id: string) {
  return prisma.enemy.delete({
    where: { id }
  });
}

// Loot operations
export async function addLoot(data: {
  encounterId: string;
  name: string;
  description?: string;
  quantity?: number;
  rarity?: string;
}) {
  return prisma.loot.create({
    data: {
      encounterId: data.encounterId,
      name: data.name,
      description: data.description || '',
      quantity: data.quantity || 1,
      rarity: data.rarity || 'common'
    }
  });
}

export async function updateLoot(id: string, data: {
  name?: string;
  description?: string;
  quantity?: number;
  rarity?: string;
}) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.quantity !== undefined) updateData.quantity = data.quantity;
  if (data.rarity !== undefined) updateData.rarity = data.rarity;

  return prisma.loot.update({
    where: { id },
    data: updateData
  });
}

export async function deleteLoot(id: string) {
  return prisma.loot.delete({
    where: { id }
  });
}
