import { Router } from 'express';
import campaignRoutes from './campaignRoutes';
import flowRoutes from './flowRoutes';
import encounterRoutes from './encounterRoutes';
import drawingRoutes from './drawingRoutes';
import spotifyRoutes from './spotifyRoutes';

const router = Router();

router.use('/campaigns', campaignRoutes);
router.use('/flow', flowRoutes);
router.use('/encounters', encounterRoutes);
router.use('/drawings', drawingRoutes);
router.use('/spotify', spotifyRoutes);

export default router;
