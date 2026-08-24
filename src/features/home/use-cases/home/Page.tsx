import { Grid, GridItem } from '@chakra-ui/react';
import { Footer } from '@BaseComponents';
import { NavigationPageShell } from '@core/components/navigation';
import { useAuthClientStore } from '@features/auth/public';

import { HomeHeader } from './HomeHeader';
import { HomeMainColumn } from './HomeMainColumn';
import { HomeSidebar } from './HomeSidebar';
import { homeNavigationPreset } from './navigation';

const footerLinks = [
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

			<Footer links={footerLinks} />
		</NavigationPageShell>
	);
}
