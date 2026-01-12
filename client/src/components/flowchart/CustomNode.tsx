import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  nodeType: 'start' | 'encounter' | 'decision' | 'end';
  hasEncounter: boolean;
  hasDrawing: boolean;
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const getNodeStyle = () => {
    const base = 'px-4 py-3 rounded-lg shadow-lg border-2 transition-all cursor-pointer min-w-[120px] text-center';
    const selectedStyle = selected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : '';

    switch (data.nodeType) {
      case 'start':
        return `${base} ${selectedStyle} bg-green-600 border-green-400`;
      case 'end':
        return `${base} ${selectedStyle} bg-red-600 border-red-400`;
      case 'decision':
        return `${base} ${selectedStyle} bg-yellow-600 border-yellow-400 transform rotate-0`;
      default:
        return `${base} ${selectedStyle} bg-blue-600 border-blue-400`;
    }
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
      />

      <div className={getNodeStyle()}>
        <div className="font-medium text-white">{data.label}</div>

        <div className="flex justify-center gap-1 mt-1">
          {data.hasEncounter && (
            <span
              className="text-xs px-1.5 py-0.5 bg-black bg-opacity-30 rounded"
              title="Has encounter"
            >
              E
            </span>
          )}
          {data.hasDrawing && (
            <span
              className="text-xs px-1.5 py-0.5 bg-black bg-opacity-30 rounded"
              title="Has map"
            >
              M
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
      />
    </>
  );
}

export default memo(CustomNode);
