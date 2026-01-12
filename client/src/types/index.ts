export interface Campaign {
  id: string;
  name: string;
  description: string;
  spotifyPlaylistId?: string;
  createdAt: string;
  updatedAt: string;
  flowNodes?: FlowNode[];
  flowEdges?: FlowEdge[];
  encounters?: Encounter[];
}

export interface FlowNode {
  id: string;
  campaignId: string;
  type: 'start' | 'encounter' | 'decision' | 'end';
  label: string;
  description: string;
  positionX: number;
  positionY: number;
  encounterId?: string;
  encounter?: Encounter;
  drawing?: Drawing;
  createdAt: string;
  updatedAt: string;
}

export interface FlowEdge {
  id: string;
  campaignId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  createdAt: string;
}

export interface Encounter {
  id: string;
  campaignId: string;
  name: string;
  storyText: string;
  dmNotes: string;
  spotifyTrackUri?: string;
  enemies?: Enemy[];
  loot?: Loot[];
  createdAt: string;
  updatedAt: string;
}

export interface Enemy {
  id: string;
  encounterId: string;
  name: string;
  hitPoints: number;
  armorClass: number;
  challenge: string;
  abilities: string;
  imageUrl?: string;
}

export interface Loot {
  id: string;
  encounterId: string;
  name: string;
  description: string;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
}

export interface Drawing {
  id: string;
  flowNodeId: string;
  canvasData: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string;
  album: string;
  uri: string;
  albumArt?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  track: SpotifyTrack | null;
  progress?: number;
  duration?: number;
}
