import SpotifyWebApi from 'spotify-web-api-node';
import { prisma } from '../config/database';

const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control'
];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

export function getAuthUrl(): string {
  return spotifyApi.createAuthorizeURL(SCOPES, 'dnd-tool-state');
}

export async function handleCallback(code: string): Promise<void> {
  const data = await spotifyApi.authorizationCodeGrant(code);

  await prisma.spotifyToken.upsert({
    where: { userId: 'default' },
    update: {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresAt: new Date(Date.now() + data.body.expires_in * 1000)
    },
    create: {
      userId: 'default',
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresAt: new Date(Date.now() + data.body.expires_in * 1000)
    }
  });
}

export async function isConnected(): Promise<boolean> {
  const token = await prisma.spotifyToken.findUnique({
    where: { userId: 'default' }
  });
  return token !== null;
}

async function ensureValidToken(): Promise<void> {
  const token = await prisma.spotifyToken.findUnique({
    where: { userId: 'default' }
  });

  if (!token) {
    throw new Error('Not authenticated with Spotify');
  }

  if (token.expiresAt < new Date()) {
    // Refresh the token
    spotifyApi.setRefreshToken(token.refreshToken);
    const data = await spotifyApi.refreshAccessToken();

    await prisma.spotifyToken.update({
      where: { userId: 'default' },
      data: {
        accessToken: data.body.access_token,
        expiresAt: new Date(Date.now() + data.body.expires_in * 1000)
      }
    });

    spotifyApi.setAccessToken(data.body.access_token);
  } else {
    spotifyApi.setAccessToken(token.accessToken);
  }
}

export async function getPlayback() {
  await ensureValidToken();
  const playback = await spotifyApi.getMyCurrentPlaybackState();

  if (!playback.body) {
    return { isPlaying: false, track: null };
  }

  const item = playback.body.item;
  const track = item && 'artists' in item ? {
    name: item.name,
    artists: item.artists.map(a => a.name).join(', '),
    album: item.album.name,
    uri: item.uri,
    albumArt: item.album.images[0]?.url
  } : null;

  return {
    isPlaying: playback.body.is_playing,
    track,
    progress: playback.body.progress_ms,
    duration: item && 'duration_ms' in item ? item.duration_ms : null
  };
}

export async function play(): Promise<void> {
  await ensureValidToken();
  await spotifyApi.play();
}

export async function pause(): Promise<void> {
  await ensureValidToken();
  await spotifyApi.pause();
}

export async function playTrack(trackUri: string): Promise<void> {
  await ensureValidToken();
  await spotifyApi.play({ uris: [trackUri] });
}

export async function searchTracks(query: string) {
  await ensureValidToken();
  const results = await spotifyApi.searchTracks(query, { limit: 10 });

  return results.body.tracks?.items.map(track => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map(a => a.name).join(', '),
    album: track.album.name,
    uri: track.uri,
    albumArt: track.album.images[0]?.url
  })) || [];
}
