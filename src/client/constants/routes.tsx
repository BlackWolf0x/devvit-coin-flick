import Splash from '@/pages/Splash';
import Ranks from '@/pages/Ranks';
import HowTo from '@/pages/HowTo';
import ChestOpen from '@/pages/ChestOpen';
import MyCollection from '@/pages/MyCollection';

export const routes = {
	pageSplash: Splash,
	pageRanks: Ranks,
	pageHowTo: HowTo,
	pageChestOpen: ChestOpen,
	pageMyCollection: MyCollection,
} as const;

export type Page = keyof typeof routes;
export const DEFAULT_PAGE: Page = 'pageSplash';
