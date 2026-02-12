import { Router } from 'express';
import onAppInstallRoute from './on-app-install';
import postDailyChallengeRoute from './post-daily-challenge';
import postBonusChallengeRoute from './post-bonus-challenge';
import schedulerPostDailyChallengeRoute from './scheduler-post-daily-challenge';
import schedulerRetryDailyChallengeRoute from './scheduler-retry-daily-challenge';
import devResetDailyLockRoute from './post-reset-daily-lock';

const router = Router();

// Mount internal routes
router.use(onAppInstallRoute);
router.use(postDailyChallengeRoute);
router.use(postBonusChallengeRoute);
router.use(schedulerPostDailyChallengeRoute);
router.use(schedulerRetryDailyChallengeRoute);
router.use(devResetDailyLockRoute);

export default router;
