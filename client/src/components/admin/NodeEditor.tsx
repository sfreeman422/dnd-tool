import { useState, useEffect } from 'react';
import type { FlowNode, Encounter } from '../../types';

interface NodeEditorProps {
  node: FlowNode;
  encounters: Encounter[];
  onUpdate: (data: Partial<FlowNode>) => void;
  onDelete: () => void;
  onEditEncounter: () => void;
  onEditDrawing: () => void;
  onCreateEncounter: () => void;
  onClose: () => void;
}

export default function NodeEditor({
  node,
  encounters,
  onUpdate,
  onDelete,
  onEditEncounter,
  onEditDrawing,
  onCreateEncounter,
  onClose
}: NodeEditorProps) {
  const [label, setLabel] = useState(node.label);
  const [description, setDescription] = useState(node.description);
  const [nodeType, setNodeType] = useState(node.type);
  const [encounterId, setEncounterId] = useState(node.encounterId || '');

  useEffect(() => {
    setLabel(node.label);
    setDescription(node.description);
    setNodeType(node.type);
    setEncounterId(node.encounterId || '');
  }, [node]);

  const handleSave = () => {
    onUpdate({
      label,
      description,
      type: nodeType,
      encounterId: encounterId || null
    });
  };

  const availableEncounters = encounters.filter(
    e => !e.flowNode || e.id === node.encounterId
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-bold">Edit Node</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Type</label>
          <select
            value={nodeType}
            onChange={e => setNodeType(e.target.value as FlowNode['type'])}
            className="w-full px-3 py-2 bg-gray-700 rounded"
          >
            <option value="start">Start</option>
            <option value="encounter">Encounter</option>
            <option value="decision">Decision</option>
            <option value="end">End</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 rounded resize-none"
          />
        </div>

        {/* Linked Encounter */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Linked Encounter</label>
          <select
            value={encounterId}
            onChange={e => setEncounterId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded mb-2"
          >
            <option value="">None</option>
            {availableEncounters.map(enc => (
              <option key={enc.id} value={enc.id}>{enc.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={onCreateEncounter}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 rounded text-sm"
            >
              Create New Encounter
            </button>
            {node.encounterId && (
              <button
                onClick={onEditEncounter}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm"
              >
                Edit Encounter
              </button>
            )}
          </div>
        </div>

        {/* Drawing */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Area Map</label>
          <button
            onClick={onEditDrawing}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded"
          >
            {node.drawing ? 'Edit Drawing' : 'Add Drawing'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Save Changes
        </button>
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
