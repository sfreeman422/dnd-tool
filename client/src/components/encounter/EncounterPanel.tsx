import { useQuery } from '@tanstack/react-query';
import { getEncounter } from '../../services/encounterApi';
import { playTrack } from '../../services/spotifyApi';
import type { FlowNode } from '../../types';

interface EncounterPanelProps {
  node: FlowNode;
  onClose: () => void;
  onViewDrawing?: () => void;
}

export default function EncounterPanel({ node, onClose, onViewDrawing }: EncounterPanelProps) {
  const { data: encounter, isLoading } = useQuery({
    queryKey: ['encounter', node.encounterId],
    queryFn: () => getEncounter(node.encounterId!),
    enabled: !!node.encounterId
  });

  const handlePlayMusic = async () => {
    if (encounter?.spotifyTrackUri) {
      try {
        await playTrack(encounter.spotifyTrackUri);
      } catch (error) {
        console.error('Failed to play track:', error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-bold">{node.label}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Node type badge */}
        <div className="mb-4">
          <span className={`
            px-2 py-1 rounded text-sm font-medium capitalize
            ${node.type === 'start' ? 'bg-green-600' : ''}
            ${node.type === 'end' ? 'bg-red-600' : ''}
            ${node.type === 'decision' ? 'bg-yellow-600' : ''}
            ${node.type === 'encounter' ? 'bg-blue-600' : ''}
          `}>
            {node.type}
          </span>
        </div>

        {/* Description */}
        {node.description && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
            <p className="text-gray-300">{node.description}</p>
          </div>
        )}

        {/* Drawing button */}
        {onViewDrawing && (
          <button
            onClick={onViewDrawing}
            className="w-full mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
          >
            View Area Map
          </button>
        )}

        {/* Encounter details */}
        {node.encounterId && (
          <>
            {isLoading ? (
              <div className="text-gray-400">Loading encounter...</div>
            ) : encounter ? (
              <div className="space-y-4">
                {/* Story text */}
                {encounter.storyText && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Story</h3>
                    <div className="bg-gray-700 rounded p-3 text-gray-200 whitespace-pre-wrap">
                      {encounter.storyText}
                    </div>
                  </div>
                )}

                {/* Music */}
                {encounter.spotifyTrackUri && (
                  <button
                    onClick={handlePlayMusic}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded flex items-center justify-center gap-2"
                  >
                    <span>Play Encounter Music</span>
                  </button>
                )}

                {/* Enemies */}
                {encounter.enemies && encounter.enemies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Enemies</h3>
                    <div className="space-y-2">
                      {encounter.enemies.map((enemy) => (
                        <div key={enemy.id} className="bg-gray-700 rounded p-3">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{enemy.name}</span>
                            <span className="text-sm text-gray-400">CR {enemy.challenge}</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            HP: {enemy.hitPoints} | AC: {enemy.armorClass}
                          </div>
                          {enemy.abilities && (
                            <div className="text-sm text-gray-300 mt-2">{enemy.abilities}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loot */}
                {encounter.loot && encounter.loot.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Loot</h3>
                    <div className="space-y-2">
                      {encounter.loot.map((item) => (
                        <div key={item.id} className="bg-gray-700 rounded p-3">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{item.name}</span>
                            <span className={`
                              text-xs px-2 py-0.5 rounded capitalize
                              ${item.rarity === 'common' ? 'bg-gray-600' : ''}
                              ${item.rarity === 'uncommon' ? 'bg-green-700' : ''}
                              ${item.rarity === 'rare' ? 'bg-blue-700' : ''}
                              ${item.rarity === 'very_rare' ? 'bg-purple-700' : ''}
                              ${item.rarity === 'legendary' ? 'bg-orange-700' : ''}
                            `}>
                              {item.rarity.replace('_', ' ')}
                            </span>
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-400">x{item.quantity}</div>
                          )}
                          {item.description && (
                            <div className="text-sm text-gray-300 mt-1">{item.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400">No encounter linked</div>
            )}
          </>
        )}

        {!node.encounterId && (
          <div className="text-gray-400">No encounter linked to this node</div>
        )}
      </div>
    </div>
  );
}
