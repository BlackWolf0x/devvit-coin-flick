import { Router } from 'express';

import userData from './user-data';
import awardReward from './reward';

const router = Router();

// Mount API routes
router.use(userData);
router.use(awardReward);

export default router;
