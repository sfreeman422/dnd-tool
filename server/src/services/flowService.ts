import { prisma } from '../config/database';

export async function getFlowData(campaignId: string) {
  const [nodes, edges] = await Promise.all([
    prisma.flowNode.findMany({
      where: { campaignId },
      include: {
        encounter: true,
        drawing: true
      }
    }),
    prisma.flowEdge.findMany({
      where: { campaignId }
    })
  ]);

  return { nodes, edges };
}

export async function createNode(data: {
  campaignId: string;
  type: string;
  label: string;
  description?: string;
  positionX: number;
  positionY: number;
  encounterId?: string;
}) {
  return prisma.flowNode.create({
    data: {
      campaignId: data.campaignId,
      type: data.type,
      label: data.label,
      description: data.description || '',
      positionX: data.positionX,
      positionY: data.positionY,
      encounterId: data.encounterId
    },
    include: {
      encounter: true,
      drawing: true
    }
  });
}

export async function updateNode(id: string, data: {
  type?: string;
  label?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  encounterId?: string | null;
}) {
  const updateData: Record<string, unknown> = {};
  if (data.type !== undefined) updateData.type = data.type;
  if (data.label !== undefined) updateData.label = data.label;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.positionX !== undefined) updateData.positionX = data.positionX;
  if (data.positionY !== undefined) updateData.positionY = data.positionY;
  if (data.encounterId !== undefined) updateData.encounterId = data.encounterId;

  return prisma.flowNode.update({
    where: { id },
    data: updateData,
    include: {
      encounter: true,
      drawing: true
    }
  });
}

export async function deleteNode(id: string) {
  return prisma.flowNode.delete({
    where: { id }
  });
}

export async function createEdge(data: {
  campaignId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}) {
  return prisma.flowEdge.create({
    data: {
      campaignId: data.campaignId,
      sourceNodeId: data.sourceNodeId,
      targetNodeId: data.targetNodeId,
      label: data.label
    }
  });
}

export async function updateEdge(id: string, data: { label?: string }) {
  return prisma.flowEdge.update({
    where: { id },
    data
  });
}

export async function deleteEdge(id: string) {
  return prisma.flowEdge.delete({
    where: { id }
  });
}

export async function bulkUpdateNodes(campaignId: string, nodes: Array<{
  id: string;
  positionX: number;
  positionY: number;
}>) {
  const updates = nodes.map(node =>
    prisma.flowNode.update({
      where: { id: node.id },
      data: {
        positionX: node.positionX,
        positionY: node.positionY
      }
    })
  );

  return prisma.$transaction(updates);
}
