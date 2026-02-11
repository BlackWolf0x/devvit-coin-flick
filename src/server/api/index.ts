import { Router } from 'express';

import playerCount from './player-count';
import playerCountUpdate from './player-count-update';
import userData from './user-data';
import openChest from './open-chest';

import awardReward from './reward';
import getPostDate from './get-post-date';
import submitTime from './submit-time';

const router = Router();

// Mount API routes
router.use(playerCount);
router.use(playerCountUpdate);
router.use(userData);
router.use(openChest);
router.use(awardReward);

router.use(getPostDate);
router.use(submitTime);

export default router;
