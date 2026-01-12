import api from './api';
import type { SpotifyTrack, PlaybackState } from '../types';

export async function getAuthUrl(): Promise<string> {
  const response = await api.get('/spotify/auth');
  return response.data.url;
}

export async function getStatus(): Promise<{ connected: boolean }> {
  const response = await api.get('/spotify/status');
  return response.data;
}

export async function getPlayback(): Promise<PlaybackState> {
  const response = await api.get('/spotify/playback');
  return response.data;
}

export async function play(): Promise<void> {
  await api.put('/spotify/play');
}

export async function pause(): Promise<void> {
  await api.put('/spotify/pause');
}

export async function playTrack(trackUri: string): Promise<void> {
  await api.put('/spotify/track', { trackUri });
}

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  const response = await api.get('/spotify/search', { params: { q: query } });
  return response.data;
}
