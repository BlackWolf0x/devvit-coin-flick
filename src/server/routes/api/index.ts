import { Router } from 'express';
import initRoute from './init';
import boardDataRoute from './board-data';
import submitScore from './submit-score';
import leaderboard from './leaderboard';
import deleteScore from './delete-score';
import topPlayer from './top-player';
import createPuzzle from './create-puzzle';

const router = Router();

// Mount API routes
router.use(initRoute);
router.use(boardDataRoute);
router.use(submitScore);
router.use(leaderboard);
router.use(deleteScore);
router.use(topPlayer);
router.use(createPuzzle);


export default router;
