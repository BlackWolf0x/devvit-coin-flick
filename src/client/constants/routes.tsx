import Splash from '@/pages/Splash';
import Leaderboard from '@/pages/Leaderboard';
import HowTo from '@/pages/HowTo';
import ChestOpen from '@/pages/Chest';
import MyCollection from '@/pages/MyCollection';

export const routes = {
	splash: Splash,
	leaderboard: Leaderboard,
	howto: HowTo,
	chest: ChestOpen,
	collection: MyCollection,
} as const;

export type Page = keyof typeof routes;
export const DEFAULT_PAGE: Page = 'splash';
