import { ColorModeProvider, Provider } from '@BaseComponents';
import { registerEventListeners } from '@Events';
import { queryClient } from '@root/core/utils/query-client/util.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

registerEventListeners(queryClient);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider>
				<ColorModeProvider>
					<App />
				</ColorModeProvider>
			</Provider>
		</QueryClientProvider>
	</StrictMode>,
);
