import { Router } from 'express';
import initRoute from './init';
import boardDataRoute from './board-data';
import submitScore from './submit-score';
import submitTime from './submit-time';
import leaderboard from './leaderboard';
import deleteScore from './delete-score';
import trackPlayer from './track-player';
import playerCount from './player-count';
import topPlayer from './top-player';
import createPuzzle from './create-puzzle';
import getPostDate from './get-post-date';

const router = Router();

// Mount API routes
router.use(initRoute);
router.use(boardDataRoute);
router.use(submitScore);
router.use(leaderboard);
router.use(deleteScore);
router.use(trackPlayer);
router.use(playerCount);
router.use(topPlayer);
router.use(createPuzzle);

// Coin game routes
router.use(getPostDate);
router.use(submitTime);

export default router;
