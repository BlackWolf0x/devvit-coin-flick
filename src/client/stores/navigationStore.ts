import { create } from 'zustand';
import { type Page, DEFAULT_PAGE } from '@/constants/routes';

interface NavigationState {
	currentPage: Page;
	history: Page[];
	navigate: (page: Page) => void;
	goBack: () => void;
	canGoBack: () => boolean;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
	currentPage: DEFAULT_PAGE,
	history: [],

	navigate: (page: Page) => {
		const { currentPage, history } = get();
		set({
			currentPage: page,
			history: [...history, currentPage],
		});
	},

	goBack: () => {
		const { history } = get();
		if (history.length > 0) {
			const newHistory = [...history];
			const previousPage = newHistory.pop()!;
			set({
				currentPage: previousPage,
				history: newHistory,
			});
		}
	},

	canGoBack: () => {
		return get().history.length > 0;
	},
}));
