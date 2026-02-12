import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigationStore } from '@/stores/navigationStore';
import { routes } from '@/constants/routes';
import { UserDataProvider } from '@/components/UserDataProvider';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
	const currentPage = useNavigationStore((state) => state.currentPage);
	const PageComponent = routes[currentPage];

	return (
		<QueryClientProvider client={queryClient}>
			<UserDataProvider>
				<PageComponent />
				<Toaster position="top-center" />
			</UserDataProvider>
		</QueryClientProvider>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
