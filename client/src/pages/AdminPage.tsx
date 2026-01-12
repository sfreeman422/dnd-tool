import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCampaigns, getCampaign, updateCampaign } from '../services/campaignApi';
import { createNode, updateNode, deleteNode, createEdge, deleteEdge } from '../services/flowApi';
import { createEncounter, updateEncounter, deleteEncounter } from '../services/encounterApi';
import CampaignFlowChart from '../components/flowchart/CampaignFlowChart';
import EncounterEditor from '../components/admin/EncounterEditor';
import NodeEditor from '../components/admin/NodeEditor';
import DrawingEditor from '../components/canvas/DrawingEditor';
import type { FlowNode, Encounter } from '../types';

type EditorMode = 'none' | 'node' | 'encounter' | 'drawing';

export default function AdminPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const queryClient = useQueryClient();

  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('none');
  const [showNodeTypeMenu, setShowNodeTypeMenu] = useState<{
    screenX: number;
    screenY: number;
    flowX: number;
    flowY: number;
  } | null>(null);

  // Fetch campaigns list for sidebar
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns
  });

  // Fetch selected campaign
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => getCampaign(campaignId!),
    enabled: !!campaignId
  });

  // Mutations
  const createNodeMutation = useMutation({
    mutationFn: (data: Parameters<typeof createNode>[1] & { campaignId: string }) =>
      createNode(data.campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    }
  });

  const updateNodeMutation = useMutation({
    mutationFn: ({ nodeId, data }: { nodeId: string; data: Parameters<typeof updateNode>[1] }) =>
      updateNode(nodeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    }
  });

  const deleteNodeMutation = useMutation({
    mutationFn: deleteNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      setSelectedNode(null);
      setEditorMode('none');
    }
  });

  const createEdgeMutation = useMutation({
    mutationFn: (data: Parameters<typeof createEdge>[1]) =>
      createEdge(campaignId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    }
  });

  const deleteEdgeMutation = useMutation({
    mutationFn: deleteEdge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    }
  });

  const createEncounterMutation = useMutation({
    mutationFn: (data: { name: string }) =>
      createEncounter(campaignId!, data),
    onSuccess: (encounter) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      return encounter;
    }
  });

  const handleNodeClick = useCallback((node: FlowNode) => {
    setSelectedNode(node);
    setEditorMode('node');
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent, flowPosition: { x: number; y: number }) => {
    // Use screen coordinates for menu position, flow coordinates for node creation
    setShowNodeTypeMenu({
      screenX: event.clientX,
      screenY: event.clientY,
      flowX: flowPosition.x,
      flowY: flowPosition.y
    });
  }, []);

  const handleCreateNode = useCallback((type: string, position: { x: number; y: number }) => {
    if (!campaignId) return;

    createNodeMutation.mutate({
      campaignId,
      type,
      label: type === 'start' ? 'Start' : type === 'end' ? 'End' : 'New Node',
      positionX: position.x,
      positionY: position.y
    });
    setShowNodeTypeMenu(null);
  }, [campaignId, createNodeMutation]);

  const handleConnect = useCallback((sourceId: string, targetId: string) => {
    createEdgeMutation.mutate({
      sourceNodeId: sourceId,
      targetNodeId: targetId
    });
  }, [createEdgeMutation]);

  const handleDeleteEdge = useCallback((edgeId: string) => {
    deleteEdgeMutation.mutate(edgeId);
  }, [deleteEdgeMutation]);

  if (!campaignId) {
    return (
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <Link to="/" className="text-gray-400 hover:text-white block mb-4">
            &larr; Back to Home
          </Link>
          <h2 className="text-lg font-bold mb-4">Campaigns</h2>
          <div className="space-y-2">
            {campaigns?.map((c) => (
              <Link
                key={c.id}
                to={`/admin/${c.id}`}
                className="block px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a campaign to edit
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        <Link to="/" className="text-gray-400 hover:text-white block mb-4">
          &larr; Back to Home
        </Link>
        <h2 className="text-lg font-bold mb-4">Campaigns</h2>
        <div className="space-y-2 mb-6">
          {campaigns?.map((c) => (
            <Link
              key={c.id}
              to={`/admin/${c.id}`}
              className={`block px-3 py-2 rounded ${
                c.id === campaignId
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {campaign && (
          <>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-gray-400">ENCOUNTERS</h3>
              <button
                onClick={() => {
                  const name = prompt('Enter encounter name:');
                  if (name) {
                    createEncounterMutation.mutate({ name });
                  }
                }}
                className="text-xs px-2 py-1 bg-green-600 hover:bg-green-500 rounded"
              >
                + New
              </button>
            </div>
            <div className="space-y-1 mb-4">
              {campaign.encounters?.map((enc) => (
                <div
                  key={enc.id}
                  className="px-3 py-1 text-sm bg-gray-700 rounded truncate"
                  title={enc.name}
                >
                  {enc.name}
                </div>
              ))}
              {(!campaign.encounters || campaign.encounters.length === 0) && (
                <div className="text-sm text-gray-500">No encounters yet</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Flow chart area */}
      <div className="flex-1 relative">
        <CampaignFlowChart
          campaignId={campaignId}
          nodes={campaign?.flowNodes || []}
          edges={campaign?.flowEdges || []}
          onNodeClick={handleNodeClick}
          onCanvasClick={handleCanvasClick}
          onConnect={handleConnect}
          onEdgeDelete={handleDeleteEdge}
          onNodePositionChange={(nodeId, position) => {
            updateNodeMutation.mutate({
              nodeId,
              data: { positionX: position.x, positionY: position.y }
            });
          }}
          isEditable={true}
        />

        {/* Toolbar */}
        <div className="absolute top-4 left-4 bg-gray-800 border border-gray-600 rounded-lg p-2 flex gap-2 z-40">
          <span className="text-sm text-gray-400 px-2 py-1">Add:</span>
          {['start', 'encounter', 'decision', 'end'].map((type) => (
            <button
              key={type}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded capitalize"
              onClick={() => {
                createNodeMutation.mutate({
                  campaignId: campaignId!,
                  type,
                  label: type === 'start' ? 'Start' : type === 'end' ? 'End' : 'New Node',
                  positionX: 100 + Math.random() * 200,
                  positionY: 100 + Math.random() * 200
                });
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Node type menu (on canvas click) */}
        {showNodeTypeMenu && (
          <div
            className="fixed bg-gray-800 border border-gray-600 rounded shadow-lg z-50"
            style={{ left: showNodeTypeMenu.screenX + 10, top: showNodeTypeMenu.screenY + 10 }}
          >
            <div className="p-2 text-sm text-gray-400">Add Node Here</div>
            {['start', 'encounter', 'decision', 'end'].map((type) => (
              <button
                key={type}
                className="block w-full px-4 py-2 text-left hover:bg-gray-700 capitalize"
                onClick={() => {
                  handleCreateNode(type, { x: showNodeTypeMenu.flowX, y: showNodeTypeMenu.flowY });
                }}
              >
                {type}
              </button>
            ))}
            <button
              className="block w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 border-t border-gray-600"
              onClick={() => setShowNodeTypeMenu(null)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Editor panel */}
      {selectedNode && editorMode !== 'none' && (
        <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          {editorMode === 'node' && (
            <NodeEditor
              node={selectedNode}
              encounters={campaign?.encounters || []}
              onUpdate={(data) => {
                updateNodeMutation.mutate({ nodeId: selectedNode.id, data });
              }}
              onDelete={() => {
                if (confirm('Delete this node?')) {
                  deleteNodeMutation.mutate(selectedNode.id);
                }
              }}
              onEditEncounter={() => setEditorMode('encounter')}
              onEditDrawing={() => setEditorMode('drawing')}
              onCreateEncounter={async () => {
                const encounter = await createEncounterMutation.mutateAsync({
                  name: `Encounter for ${selectedNode.label}`
                });
                updateNodeMutation.mutate({
                  nodeId: selectedNode.id,
                  data: { encounterId: encounter.id }
                });
              }}
              onClose={() => {
                setSelectedNode(null);
                setEditorMode('none');
              }}
            />
          )}

          {editorMode === 'encounter' && selectedNode.encounter && (
            <EncounterEditor
              encounter={selectedNode.encounter}
              onBack={() => setEditorMode('node')}
            />
          )}

          {editorMode === 'drawing' && (
            <DrawingEditor
              nodeId={selectedNode.id}
              initialData={selectedNode.drawing?.canvasData}
              onBack={() => setEditorMode('node')}
              onSave={() => {
                queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
