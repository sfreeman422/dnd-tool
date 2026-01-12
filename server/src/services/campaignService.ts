import { prisma } from '../config/database';

export async function getAllCampaigns() {
  return prisma.campaign.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getCampaignById(id: string) {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      flowNodes: {
        include: {
          encounter: true,
          drawing: true
        }
      },
      flowEdges: true,
      encounters: true
    }
  });
}

export async function createCampaign(data: {
  name: string;
  description?: string;
  spotifyPlaylistId?: string;
}) {
  return prisma.campaign.create({
    data: {
      name: data.name,
      description: data.description || '',
      spotifyPlaylistId: data.spotifyPlaylistId
    }
  });
}

export async function updateCampaign(id: string, data: {
  name?: string;
  description?: string;
  spotifyPlaylistId?: string;
}) {
  return prisma.campaign.update({
    where: { id },
    data
  });
}

export async function deleteCampaign(id: string) {
  return prisma.campaign.delete({
    where: { id }
  });
}
