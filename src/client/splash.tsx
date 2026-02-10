import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigationStore } from '@/stores/navigationStore';
import { routes } from '@/constants/routes';

const queryClient = new QueryClient();

function App() {
	const currentPage = useNavigationStore((state) => state.currentPage);
	const PageComponent = routes[currentPage];

	return (
		<QueryClientProvider client={queryClient}>
			<PageComponent />
		</QueryClientProvider>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
