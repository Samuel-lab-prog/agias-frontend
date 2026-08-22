import { ColorModeProvider, Provider } from '@BaseComponents';
import { ChakraProvider } from '@chakra-ui/react';
import { registerUsersCachePort } from '@core/ports/users';
import { registerEventListeners } from '@Events';
import { queryClient } from '@QueryClient';
import { usersCachePort } from '@root/features/users/adapters/usersCachePort.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { system } from '@themes/main';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

registerUsersCachePort(usersCachePort);
registerEventListeners(queryClient);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider>
				<ChakraProvider value={system}>
					<ColorModeProvider>
						<App />
					</ColorModeProvider>
				</ChakraProvider>
			</Provider>
		</QueryClientProvider>
	</StrictMode>,
);
