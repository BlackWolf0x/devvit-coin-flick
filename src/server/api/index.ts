import { Router } from 'express';

import playerCount from './player-count';
import playerCountUpdate from './player-count-update';
import userData from './user-data';
import awardReward from './reward';

const router = Router();

// Mount API routes
router.use(playerCount);
router.use(playerCountUpdate);
router.use(userData);
router.use(awardReward);

export default router;
