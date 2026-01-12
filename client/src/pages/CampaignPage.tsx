import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCampaign } from '../services/campaignApi';
import CampaignFlowChart from '../components/flowchart/CampaignFlowChart';
import EncounterPanel from '../components/encounter/EncounterPanel';
import SpotifyPlayer from '../components/spotify/SpotifyPlayer';
import DrawingModal from '../components/canvas/DrawingModal';
import type { FlowNode } from '../types';

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [showDrawing, setShowDrawing] = useState(false);

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => getCampaign(id!),
    enabled: !!id
  });

  const handleNodeClick = useCallback((node: FlowNode) => {
    setSelectedNode(node);
  }, []);

  const handleViewDrawing = useCallback(() => {
    setShowDrawing(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading campaign...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-red-500 mb-4">Failed to load campaign</div>
        <Link to="/" className="text-blue-400 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-400 hover:text-white">
            &larr; Back
          </Link>
          <h1 className="text-xl font-bold">{campaign.name}</h1>
        </div>
        <SpotifyPlayer />
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Flow chart */}
        <div className="flex-1 relative">
          <CampaignFlowChart
            campaignId={campaign.id}
            nodes={campaign.flowNodes || []}
            edges={campaign.flowEdges || []}
            onNodeClick={handleNodeClick}
            isEditable={false}
          />
        </div>

        {/* Side panel */}
        {selectedNode && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <EncounterPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onViewDrawing={selectedNode.drawing ? handleViewDrawing : undefined}
            />
          </div>
        )}
      </div>

      {/* Drawing modal */}
      {showDrawing && selectedNode?.drawing && (
        <DrawingModal
          canvasData={selectedNode.drawing.canvasData}
          onClose={() => setShowDrawing(false)}
        />
      )}
    </div>
  );
}
