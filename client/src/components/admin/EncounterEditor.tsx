import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateEncounter,
  addEnemy,
  updateEnemy,
  deleteEnemy,
  addLoot,
  updateLoot,
  deleteLoot
} from '../../services/encounterApi';
import { searchTracks } from '../../services/spotifyApi';
import type { Encounter, Enemy, Loot, SpotifyTrack } from '../../types';

interface EncounterEditorProps {
  encounter: Encounter;
  onBack: () => void;
}

export default function EncounterEditor({ encounter, onBack }: EncounterEditorProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState(encounter.name);
  const [storyText, setStoryText] = useState(encounter.storyText);
  const [dmNotes, setDmNotes] = useState(encounter.dmNotes);
  const [spotifyTrackUri, setSpotifyTrackUri] = useState(encounter.spotifyTrackUri || '');

  const [trackSearch, setTrackSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const [enemies, setEnemies] = useState<Enemy[]>(encounter.enemies || []);
  const [loot, setLoot] = useState<Loot[]>(encounter.loot || []);

  const [showAddEnemy, setShowAddEnemy] = useState(false);
  const [showAddLoot, setShowAddLoot] = useState(false);

  useEffect(() => {
    setName(encounter.name);
    setStoryText(encounter.storyText);
    setDmNotes(encounter.dmNotes);
    setSpotifyTrackUri(encounter.spotifyTrackUri || '');
    setEnemies(encounter.enemies || []);
    setLoot(encounter.loot || []);
  }, [encounter]);

  const updateMutation = useMutation({
    mutationFn: () => updateEncounter(encounter.id, { name, storyText, dmNotes, spotifyTrackUri }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['encounter'] });
    }
  });

  const handleSearchTracks = async () => {
    if (!trackSearch.trim()) return;
    try {
      const results = await searchTracks(trackSearch);
      setSearchResults(results);
      setShowSearch(true);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSelectTrack = (track: SpotifyTrack) => {
    setSpotifyTrackUri(track.uri);
    setShowSearch(false);
    setTrackSearch('');
    setSearchResults([]);
  };

  // Enemy mutations
  const addEnemyMutation = useMutation({
    mutationFn: (data: Parameters<typeof addEnemy>[1]) => addEnemy(encounter.id, data),
    onSuccess: (newEnemy) => {
      setEnemies([...enemies, newEnemy]);
      setShowAddEnemy(false);
      queryClient.invalidateQueries({ queryKey: ['encounter'] });
    }
  });

  const deleteEnemyMutation = useMutation({
    mutationFn: deleteEnemy,
    onSuccess: (_, id) => {
      setEnemies(enemies.filter(e => e.id !== id));
    }
  });

  // Loot mutations
  const addLootMutation = useMutation({
    mutationFn: (data: Parameters<typeof addLoot>[1]) => addLoot(encounter.id, data),
    onSuccess: (newLoot) => {
      setLoot([...loot, newLoot]);
      setShowAddLoot(false);
      queryClient.invalidateQueries({ queryKey: ['encounter'] });
    }
  });

  const deleteLootMutation = useMutation({
    mutationFn: deleteLoot,
    onSuccess: (_, id) => {
      setLoot(loot.filter(l => l.id !== id));
    }
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          &larr; Back
        </button>
        <h2 className="text-lg font-bold">Edit Encounter</h2>
        <button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
          className="px-4 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded"
          />
        </div>

        {/* Story Text */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Story Text (players see this)</label>
          <textarea
            value={storyText}
            onChange={e => setStoryText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 rounded resize-none"
            placeholder="The narrative description for this encounter..."
          />
        </div>

        {/* DM Notes */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">DM Notes (private)</label>
          <textarea
            value={dmNotes}
            onChange={e => setDmNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 rounded resize-none"
            placeholder="Private notes for the DM..."
          />
        </div>

        {/* Spotify Track */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Background Music</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={trackSearch}
              onChange={e => setTrackSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearchTracks()}
              placeholder="Search for a track..."
              className="flex-1 px-3 py-2 bg-gray-700 rounded"
            />
            <button
              onClick={handleSearchTracks}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
            >
              Search
            </button>
          </div>

          {spotifyTrackUri && (
            <div className="flex items-center gap-2 p-2 bg-gray-700 rounded">
              <span className="text-sm text-gray-300 flex-1 truncate">{spotifyTrackUri}</span>
              <button
                onClick={() => setSpotifyTrackUri('')}
                className="text-red-400 hover:text-red-300"
              >
                &times;
              </button>
            </div>
          )}

          {showSearch && searchResults.length > 0 && (
            <div className="mt-2 bg-gray-700 rounded max-h-48 overflow-y-auto">
              {searchResults.map(track => (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(track)}
                  className="w-full p-2 text-left hover:bg-gray-600 flex items-center gap-2"
                >
                  {track.albumArt && (
                    <img src={track.albumArt} alt="" className="w-8 h-8 rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{track.name}</div>
                    <div className="text-xs text-gray-400 truncate">{track.artists}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Enemies */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">Enemies</label>
            <button
              onClick={() => setShowAddEnemy(true)}
              className="text-sm px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              + Add Enemy
            </button>
          </div>

          {enemies.length > 0 ? (
            <div className="space-y-2">
              {enemies.map(enemy => (
                <div key={enemy.id} className="p-2 bg-gray-700 rounded flex justify-between items-start">
                  <div>
                    <div className="font-medium">{enemy.name}</div>
                    <div className="text-xs text-gray-400">
                      CR {enemy.challenge} | HP {enemy.hitPoints} | AC {enemy.armorClass}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEnemyMutation.mutate(enemy.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No enemies</div>
          )}

          {showAddEnemy && (
            <AddEnemyForm
              onAdd={(data) => addEnemyMutation.mutate(data)}
              onCancel={() => setShowAddEnemy(false)}
            />
          )}
        </div>

        {/* Loot */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">Loot</label>
            <button
              onClick={() => setShowAddLoot(true)}
              className="text-sm px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              + Add Loot
            </button>
          </div>

          {loot.length > 0 ? (
            <div className="space-y-2">
              {loot.map(item => (
                <div key={item.id} className="p-2 bg-gray-700 rounded flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.rarity} {item.quantity > 1 && `x${item.quantity}`}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteLootMutation.mutate(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No loot</div>
          )}

          {showAddLoot && (
            <AddLootForm
              onAdd={(data) => addLootMutation.mutate(data)}
              onCancel={() => setShowAddLoot(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Add Enemy Form
function AddEnemyForm({
  onAdd,
  onCancel
}: {
  onAdd: (data: { name: string; hitPoints: number; armorClass: number; challenge: string; abilities?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [hitPoints, setHitPoints] = useState(10);
  const [armorClass, setArmorClass] = useState(10);
  const [challenge, setChallenge] = useState('1');
  const [abilities, setAbilities] = useState('');

  return (
    <div className="mt-2 p-3 bg-gray-600 rounded space-y-2">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enemy name"
        className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          value={hitPoints}
          onChange={e => setHitPoints(parseInt(e.target.value) || 0)}
          placeholder="HP"
          className="px-2 py-1 bg-gray-700 rounded text-sm"
        />
        <input
          type="number"
          value={armorClass}
          onChange={e => setArmorClass(parseInt(e.target.value) || 0)}
          placeholder="AC"
          className="px-2 py-1 bg-gray-700 rounded text-sm"
        />
        <input
          type="text"
          value={challenge}
          onChange={e => setChallenge(e.target.value)}
          placeholder="CR"
          className="px-2 py-1 bg-gray-700 rounded text-sm"
        />
      </div>
      <textarea
        value={abilities}
        onChange={e => setAbilities(e.target.value)}
        placeholder="Abilities (optional)"
        rows={2}
        className="w-full px-2 py-1 bg-gray-700 rounded text-sm resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onAdd({ name, hitPoints, armorClass, challenge, abilities })}
          disabled={!name}
          className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-sm disabled:opacity-50"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Add Loot Form
function AddLootForm({
  onAdd,
  onCancel
}: {
  onAdd: (data: { name: string; description?: string; quantity?: number; rarity?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [rarity, setRarity] = useState('common');

  return (
    <div className="mt-2 p-3 bg-gray-600 rounded space-y-2">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Item name"
        className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(parseInt(e.target.value) || 1)}
          min={1}
          className="px-2 py-1 bg-gray-700 rounded text-sm"
        />
        <select
          value={rarity}
          onChange={e => setRarity(e.target.value)}
          className="px-2 py-1 bg-gray-700 rounded text-sm"
        >
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="very_rare">Very Rare</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full px-2 py-1 bg-gray-700 rounded text-sm resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onAdd({ name, description, quantity, rarity })}
          disabled={!name}
          className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-sm disabled:opacity-50"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
