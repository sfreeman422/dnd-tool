import { Router } from 'express';
import * as encounterController from '../controllers/encounterController';

const router = Router();

// Encounter CRUD
router.get('/:id', encounterController.getEncounterById);
router.post('/campaigns/:campaignId', encounterController.createEncounter);
router.put('/:id', encounterController.updateEncounter);
router.delete('/:id', encounterController.deleteEncounter);

// Enemy CRUD
router.post('/:encounterId/enemies', encounterController.addEnemy);
router.put('/enemies/:id', encounterController.updateEnemy);
router.delete('/enemies/:id', encounterController.deleteEnemy);

// Loot CRUD
router.post('/:encounterId/loot', encounterController.addLoot);
router.put('/loot/:id', encounterController.updateLoot);
router.delete('/loot/:id', encounterController.deleteLoot);

export default router;
