import { Request, Response } from 'express';
import * as spotifyService from '../services/spotifyService';

export async function getAuthUrl(req: Request, res: Response) {
  try {
    const authUrl = spotifyService.getAuthUrl();
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ error: 'Failed to get auth URL' });
  }
}

export async function handleCallback(req: Request, res: Response) {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL}?spotify_error=${error}`);
    }

    if (!code || typeof code !== 'string') {
      return res.redirect(`${process.env.FRONTEND_URL}?spotify_error=no_code`);
    }

    await spotifyService.handleCallback(code);
    res.redirect(`${process.env.FRONTEND_URL}?spotify_connected=true`);
  } catch (error) {
    console.error('Error handling callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}?spotify_error=callback_failed`);
  }
}

export async function getStatus(req: Request, res: Response) {
  try {
    const isConnected = await spotifyService.isConnected();
    res.json({ connected: isConnected });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
}

export async function getPlayback(req: Request, res: Response) {
  try {
    const playback = await spotifyService.getPlayback();
    res.json(playback);
  } catch (error) {
    console.error('Error getting playback:', error);
    res.status(500).json({ error: 'Failed to get playback' });
  }
}

export async function play(req: Request, res: Response) {
  try {
    await spotifyService.play();
    res.json({ success: true });
  } catch (error) {
    console.error('Error playing:', error);
    res.status(500).json({ error: 'Failed to play' });
  }
}

export async function pause(req: Request, res: Response) {
  try {
    await spotifyService.pause();
    res.json({ success: true });
  } catch (error) {
    console.error('Error pausing:', error);
    res.status(500).json({ error: 'Failed to pause' });
  }
}

export async function playTrack(req: Request, res: Response) {
  try {
    const { trackUri } = req.body;

    if (!trackUri) {
      return res.status(400).json({ error: 'trackUri is required' });
    }

    await spotifyService.playTrack(trackUri);
    res.json({ success: true });
  } catch (error) {
    console.error('Error playing track:', error);
    res.status(500).json({ error: 'Failed to play track' });
  }
}

export async function searchTracks(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const tracks = await spotifyService.searchTracks(q);
    res.json(tracks);
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
}
