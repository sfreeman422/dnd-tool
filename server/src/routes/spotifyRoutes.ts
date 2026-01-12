import { Router } from 'express';
import * as spotifyController from '../controllers/spotifyController';

const router = Router();

// OAuth flow
router.get('/auth', spotifyController.getAuthUrl);
router.get('/callback', spotifyController.handleCallback);
router.get('/status', spotifyController.getStatus);

// Playback control
router.get('/playback', spotifyController.getPlayback);
router.put('/play', spotifyController.play);
router.put('/pause', spotifyController.pause);
router.put('/track', spotifyController.playTrack);

// Search
router.get('/search', spotifyController.searchTracks);

export default router;
