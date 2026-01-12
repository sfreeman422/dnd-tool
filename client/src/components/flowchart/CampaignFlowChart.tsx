import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  NodeMouseHandler,
  EdgeMouseHandler,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import type { FlowNode, FlowEdge } from '../../types';

const nodeTypes = {
  custom: CustomNode
};

interface CampaignFlowChartProps {
  campaignId: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodeClick: (node: FlowNode) => void;
  onCanvasClick?: (event: React.MouseEvent, position: { x: number; y: number }) => void;
  onConnect?: (sourceId: string, targetId: string) => void;
  onEdgeDelete?: (edgeId: string) => void;
  onNodePositionChange?: (nodeId: string, position: { x: number; y: number }) => void;
  isEditable: boolean;
}

export default function CampaignFlowChart({
  nodes: flowNodes,
  edges: flowEdges,
  onNodeClick,
  onCanvasClick,
  onConnect,
  onEdgeDelete,
  onNodePositionChange,
  isEditable
}: CampaignFlowChartProps) {
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Convert to React Flow format
  const initialNodes: Node[] = useMemo(() =>
    flowNodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: { x: node.positionX, y: node.positionY },
      data: {
        label: node.label,
        nodeType: node.type,
        hasEncounter: !!node.encounterId,
        hasDrawing: !!node.drawing,
        originalNode: node
      }
    })),
    [flowNodes]
  );

  const initialEdges: Edge[] = useMemo(() =>
    flowEdges.map((edge) => ({
      id: edge.id,
      source: edge.sourceNodeId,
      target: edge.targetNodeId,
      label: edge.label,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#6b7280' },
      labelStyle: { fill: '#9ca3af', fontSize: 12 }
    })),
    [flowEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when props change
  useMemo(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useMemo(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const originalNode = node.data.originalNode as FlowNode;
      onNodeClick(originalNode);
    },
    [onNodeClick]
  );

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isEditable || !onCanvasClick || !reactFlowInstance.current) return;

      // Convert screen coordinates to flow coordinates (accounts for zoom/pan)
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      onCanvasClick(event, position);
    },
    [isEditable, onCanvasClick]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!isEditable || !onConnect) return;
      if (connection.source && connection.target) {
        onConnect(connection.source, connection.target);
      }
    },
    [isEditable, onConnect]
  );

  const handleEdgeClick: EdgeMouseHandler = useCallback(
    (_, edge) => {
      if (!isEditable || !onEdgeDelete) return;
      if (confirm('Delete this connection?')) {
        onEdgeDelete(edge.id);
      }
    },
    [isEditable, onEdgeDelete]
  );

  const handleNodeDragStop: NodeMouseHandler = useCallback(
    (_, node) => {
      if (!isEditable || !onNodePositionChange) return;
      onNodePositionChange(node.id, node.position);
    },
    [isEditable, onNodePositionChange]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isEditable ? onNodesChange : undefined}
        onEdgesChange={isEditable ? onEdgesChange : undefined}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onConnect={handleConnect}
        onEdgeClick={handleEdgeClick}
        onNodeDragStop={handleNodeDragStop}
        onInit={(instance) => { reactFlowInstance.current = instance; }}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={isEditable}
        nodesConnectable={isEditable}
        elementsSelectable={true}
        minZoom={0.2}
        maxZoom={2}
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data.nodeType) {
              case 'start':
                return '#22c55e';
              case 'end':
                return '#ef4444';
              case 'decision':
                return '#eab308';
              default:
                return '#3b82f6';
            }
          }}
        />
        <Background color="#374151" gap={20} />
      </ReactFlow>
    </div>
  );
}
