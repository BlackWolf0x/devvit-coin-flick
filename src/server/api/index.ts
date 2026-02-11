import { Router } from 'express';

import playerCount from './player-count';
import playerCountUpdate from './player-count-update';
import userData from './user-data';
import openChest from './open-chest';

import awardReward from './reward';

const router = Router();

// Mount API routes
router.use(playerCount);
router.use(playerCountUpdate);
router.use(userData);
router.use(openChest);

router.use(awardReward);

export default router;
