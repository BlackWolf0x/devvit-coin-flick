import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import GameCanvas from '@/components/GameCanvas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserDataProvider } from '@/components/UserDataProvider';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<UserDataProvider>
				<GameCanvas />
				<Toaster position="top-center" />
			</UserDataProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
