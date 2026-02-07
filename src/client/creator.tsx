import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Creator from '@/pages/Creator';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Creator />
		</QueryClientProvider>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
