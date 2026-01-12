import { useMemo } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text } from 'react-konva';

interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  text?: string;
  fill: string;
  stroke: string;
  strokeWidth?: number;
}

interface DrawingModalProps {
  canvasData: string;
  onClose: () => void;
}

export default function DrawingModal({ canvasData, onClose }: DrawingModalProps) {
  const shapes: Shape[] = useMemo(() => {
    try {
      return JSON.parse(canvasData);
    } catch {
      return [];
    }
  }, [canvasData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg overflow-hidden max-w-4xl max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Area Map</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          <Stage width={800} height={600} className="bg-gray-900 rounded">
            <Layer>
              {shapes.map((shape) => {
                if (shape.type === 'rect') {
                  return (
                    <Rect
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.fill}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth || 2}
                    />
                  );
                }
                if (shape.type === 'circle') {
                  return (
                    <Circle
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      fill={shape.fill}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth || 2}
                    />
                  );
                }
                if (shape.type === 'line' || shape.type === 'freehand') {
                  return (
                    <Line
                      key={shape.id}
                      points={shape.points}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth || 2}
                      lineCap="round"
                      lineJoin="round"
                    />
                  );
                }
                if (shape.type === 'text') {
                  return (
                    <Text
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      text={shape.text}
                      fill={shape.stroke}
                      fontSize={16}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
