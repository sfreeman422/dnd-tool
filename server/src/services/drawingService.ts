import { prisma } from '../config/database';

export async function getDrawingByNodeId(nodeId: string) {
  return prisma.drawing.findUnique({
    where: { flowNodeId: nodeId }
  });
}

export async function saveDrawing(data: {
  flowNodeId: string;
  canvasData: string;
  thumbnailUrl?: string;
}) {
  return prisma.drawing.upsert({
    where: { flowNodeId: data.flowNodeId },
    update: {
      canvasData: data.canvasData,
      thumbnailUrl: data.thumbnailUrl
    },
    create: {
      flowNodeId: data.flowNodeId,
      canvasData: data.canvasData,
      thumbnailUrl: data.thumbnailUrl
    }
  });
}

export async function deleteDrawing(nodeId: string) {
  return prisma.drawing.delete({
    where: { flowNodeId: nodeId }
  });
}
