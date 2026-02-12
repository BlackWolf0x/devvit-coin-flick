import { Router } from 'express';
import onAppInstallRoute from './on-app-install';
import postDailyChallengeRoute from './post-daily-challenge';
import schedulerPostDailyChallengeRoute from './scheduler-post-daily-challenge';
import schedulerRetryDailyChallengeRoute from './scheduler-retry-daily-challenge';
import devResetDailyLockRoute from './dev-reset-daily-lock';

const router = Router();

// Mount internal routes
router.use(onAppInstallRoute);
router.use(postDailyChallengeRoute);
router.use(schedulerPostDailyChallengeRoute);
router.use(schedulerRetryDailyChallengeRoute);
router.use(devResetDailyLockRoute);

export default router;
