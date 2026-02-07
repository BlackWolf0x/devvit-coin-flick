import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Splash from '@/pages/Splash';
import Leaderboard from '@/pages/Leaderboard';
import Rules from '@/pages/Rules';

const queryClient = new QueryClient();

type Page = 'splash' | 'leaderboard' | 'rules';

function App() {
	const [currentPage, setCurrentPage] = useState<Page>('splash');

	return (
		<QueryClientProvider client={queryClient}>
			{currentPage === 'leaderboard' ? (
				<Leaderboard onBack={() => setCurrentPage('splash')} />
			) : currentPage === 'rules' ? (
				<Rules onBack={() => setCurrentPage('splash')} />
			) : (
				<Splash
					onShowLeaderboard={() => setCurrentPage('leaderboard')}
					onShowRules={() => setCurrentPage('rules')}
				/>
			)}
		</QueryClientProvider>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
