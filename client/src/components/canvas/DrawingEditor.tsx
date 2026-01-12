import { useState, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Transformer } from 'react-konva';
import { useMutation } from '@tanstack/react-query';
import { saveDrawing } from '../../services/drawingApi';
import type Konva from 'konva';

type Tool = 'select' | 'rect' | 'circle' | 'line' | 'freehand' | 'text';

interface Shape {
  id: string;
  type: Tool;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  text?: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

interface DrawingEditorProps {
  nodeId: string;
  initialData?: string;
  onBack: () => void;
  onSave: () => void;
}

export default function DrawingEditor({ nodeId, initialData, onBack, onSave }: DrawingEditorProps) {
  const [tool, setTool] = useState<Tool>('select');
  const [shapes, setShapes] = useState<Shape[]>(() => {
    if (initialData) {
      try {
        return JSON.parse(initialData);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [fillColor, setFillColor] = useState('transparent');
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState<{ x: number; y: number } | null>(null);

  const stageRef = useRef<Konva.Stage>(null);
  const currentLineRef = useRef<number[]>([]);

  const saveMutation = useMutation({
    mutationFn: () => saveDrawing(nodeId, { canvasData: JSON.stringify(shapes) }),
    onSuccess: () => {
      onSave();
    }
  });

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
      return;
    }

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (tool === 'text') {
      setShowTextInput({ x: pos.x, y: pos.y });
      return;
    }

    const id = `shape-${Date.now()}`;

    if (tool === 'freehand') {
      setIsDrawing(true);
      currentLineRef.current = [pos.x, pos.y];
      setShapes([...shapes, {
        id,
        type: 'freehand',
        x: 0,
        y: 0,
        points: [pos.x, pos.y],
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: 2
      }]);
      return;
    }

    const newShape: Shape = {
      id,
      type: tool,
      x: pos.x,
      y: pos.y,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 2
    };

    if (tool === 'rect') {
      newShape.width = 100;
      newShape.height = 80;
    } else if (tool === 'circle') {
      newShape.radius = 50;
    } else if (tool === 'line') {
      newShape.points = [pos.x, pos.y, pos.x + 100, pos.y];
    }

    setShapes([...shapes, newShape]);
    setSelectedId(id);
    setTool('select');
  }, [tool, shapes, strokeColor, fillColor]);

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || tool !== 'freehand') return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    currentLineRef.current = [...currentLineRef.current, pos.x, pos.y];

    setShapes(prev => {
      const newShapes = [...prev];
      const lastShape = newShapes[newShapes.length - 1];
      if (lastShape && lastShape.type === 'freehand') {
        lastShape.points = currentLineRef.current;
      }
      return newShapes;
    });
  }, [isDrawing, tool]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    currentLineRef.current = [];
  }, []);

  const handleAddText = useCallback(() => {
    if (!showTextInput || !textInput.trim()) {
      setShowTextInput(null);
      setTextInput('');
      return;
    }

    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type: 'text',
      x: showTextInput.x,
      y: showTextInput.y,
      text: textInput,
      fill: 'transparent',
      stroke: strokeColor,
      strokeWidth: 2
    };

    setShapes([...shapes, newShape]);
    setShowTextInput(null);
    setTextInput('');
    setTool('select');
  }, [showTextInput, textInput, shapes, strokeColor]);

  const handleDelete = useCallback(() => {
    if (selectedId) {
      setShapes(shapes.filter(s => s.id !== selectedId));
      setSelectedId(null);
    }
  }, [selectedId, shapes]);

  const handleClear = useCallback(() => {
    if (confirm('Clear all shapes?')) {
      setShapes([]);
      setSelectedId(null);
    }
  }, []);

  const tools: { id: Tool; label: string }[] = [
    { id: 'select', label: 'Select' },
    { id: 'rect', label: 'Rectangle' },
    { id: 'circle', label: 'Circle' },
    { id: 'line', label: 'Line' },
    { id: 'freehand', label: 'Draw' },
    { id: 'text', label: 'Text' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          &larr; Back
        </button>
        <h2 className="text-lg font-bold">Edit Drawing</h2>
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="px-4 py-1 bg-blue-600 hover:bg-blue-500 rounded"
        >
          {saveMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-2 border-b border-gray-700 flex flex-wrap gap-2">
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`px-3 py-1 rounded text-sm ${
              tool === t.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}

        <div className="w-px bg-gray-600 mx-1" />

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">Stroke:</span>
          <input
            type="color"
            value={strokeColor}
            onChange={e => setStrokeColor(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">Fill:</span>
          <input
            type="color"
            value={fillColor === 'transparent' ? '#000000' : fillColor}
            onChange={e => setFillColor(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer"
          />
          <button
            onClick={() => setFillColor('transparent')}
            className={`text-xs px-1 ${fillColor === 'transparent' ? 'text-blue-400' : 'text-gray-400'}`}
          >
            None
          </button>
        </div>

        <div className="w-px bg-gray-600 mx-1" />

        <button
          onClick={handleDelete}
          disabled={!selectedId}
          className="px-3 py-1 rounded text-sm bg-red-700 hover:bg-red-600 disabled:opacity-50"
        >
          Delete
        </button>

        <button
          onClick={handleClear}
          className="px-3 py-1 rounded text-sm bg-gray-700 hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-4">
        <div className="relative">
          <Stage
            ref={stageRef}
            width={600}
            height={400}
            className="bg-gray-900 rounded border border-gray-600"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              {shapes.map((shape) => {
                const isSelected = shape.id === selectedId;

                if (shape.type === 'rect') {
                  return (
                    <Rect
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.fill}
                      stroke={isSelected ? '#3b82f6' : shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      draggable={tool === 'select'}
                      onClick={() => setSelectedId(shape.id)}
                      onDragEnd={(e) => {
                        setShapes(shapes.map(s =>
                          s.id === shape.id ? { ...s, x: e.target.x(), y: e.target.y() } : s
                        ));
                      }}
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
                      stroke={isSelected ? '#3b82f6' : shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      draggable={tool === 'select'}
                      onClick={() => setSelectedId(shape.id)}
                      onDragEnd={(e) => {
                        setShapes(shapes.map(s =>
                          s.id === shape.id ? { ...s, x: e.target.x(), y: e.target.y() } : s
                        ));
                      }}
                    />
                  );
                }
                if (shape.type === 'line' || shape.type === 'freehand') {
                  return (
                    <Line
                      key={shape.id}
                      points={shape.points}
                      stroke={isSelected ? '#3b82f6' : shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      lineCap="round"
                      lineJoin="round"
                      onClick={() => setSelectedId(shape.id)}
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
                      draggable={tool === 'select'}
                      onClick={() => setSelectedId(shape.id)}
                      onDragEnd={(e) => {
                        setShapes(shapes.map(s =>
                          s.id === shape.id ? { ...s, x: e.target.x(), y: e.target.y() } : s
                        ));
                      }}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>

          {/* Text input overlay */}
          {showTextInput && (
            <div
              className="absolute"
              style={{ left: showTextInput.x, top: showTextInput.y }}
            >
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddText()}
                onBlur={handleAddText}
                className="px-2 py-1 bg-gray-700 border border-gray-500 rounded text-sm"
                placeholder="Enter text..."
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
