import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Splash from '@/pages/Splash';
import Leaderboard from '@/pages/Leaderboard';
import HowTo from '@/pages/HowTo';
import ChestOpen from '@/pages/Chest';
import MyCollection from '@/pages/MyCollection';

const queryClient = new QueryClient();

type Page = 'splash' | 'leaderboard' | 'howto' | 'chestOpen' | 'myCollection';

function App() {
	const [currentPage, setCurrentPage] = useState<Page>('splash');

	return (
		<QueryClientProvider client={queryClient}>
			{currentPage === 'leaderboard' ? (
				<Leaderboard onBack={() => setCurrentPage('splash')} />
			) : currentPage === 'howto' ? (
				<HowTo onBack={() => setCurrentPage('splash')} />
			) : currentPage === 'chestOpen' ? (
				<ChestOpen onBack={() => setCurrentPage('splash')} />
			) : currentPage === 'myCollection' ? (
				<MyCollection onBack={() => setCurrentPage('splash')} />
			) : (
				<Splash
					onShowLeaderboard={() => setCurrentPage('leaderboard')}
					onShowHowTo={() => setCurrentPage('howto')}
					onShowChest={() => setCurrentPage('chestOpen')}
					onShowMyCollection={() => setCurrentPage('myCollection')}
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
