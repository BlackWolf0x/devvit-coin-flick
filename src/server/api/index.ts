import { Router } from 'express';

import playerCount from './player-count';
import playerCountUpdate from './player-count-update';
import userData from './user-data';
import openChest from './open-chest';
import setActiveCoin from './set-active-coin';
import getUserCoinData from './get-user-coin-data';

import awardReward from './reward';
import getGameData from './get-game-data';
import submitTime from './submit-time';

const router = Router();

// Mount API routes
router.use(playerCount);
router.use(playerCountUpdate);
router.use(userData);
router.use(openChest);
router.use(setActiveCoin);
router.use(getUserCoinData);
router.use(awardReward);

router.use(getGameData);
router.use(submitTime);

export default router;
