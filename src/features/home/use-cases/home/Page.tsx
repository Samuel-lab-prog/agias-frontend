import { Grid, GridItem } from '@chakra-ui/react';
import { homeNavigationPreset, NavigationPageShell } from '@core/components/navigation';
import { useAuthClientStore } from '@features/auth/public';

import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';
import { HomeMainColumn } from './HomeMainColumn';
import { HomeSidebar } from './HomeSidebar';

const footerLinks = [
	{ label: 'Página inicial', to: '/' },
	{ label: 'Login', to: '/login' },
];

export function HomePage() {
	const authClient = useAuthClientStore((state) => state.authClient);

	return (
		<NavigationPageShell preset={homeNavigationPreset}>
			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 420px' }}
				gap={4}
				alignItems='start'
			>
				<GridItem>
					<HomeHeader authClient={authClient} />
					<HomeMainColumn />
				</GridItem>

				<GridItem>
					<HomeSidebar authClient={authClient} />
				</GridItem>
			</Grid>

			<HomeFooter links={footerLinks} />
		</NavigationPageShell>
	);
}
