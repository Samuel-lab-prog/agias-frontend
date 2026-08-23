import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { useAuthClientStore } from '@features/auth/public';

import { HomeFooter } from './home/HomeFooter';
import { HomeMainColumn } from './home/HomeMainColumn';
import { HomeNavigationSidebar } from './home/HomeNavigationSidebar';
import { HomeSidebar } from './home/HomeSidebar';
import { HomeTopBar } from './home/HomeTopBar';

const footerLinks = [
	{ label: 'Página inicial', to: '/' },
	{ label: 'Login', to: '/login' },
];

export function HomePage() {
	const authClient = useAuthClientStore((state) => state.authClient);

	return (
		<Flex as='main' layerStyle='main' minH='100%' direction='column'>
			<Flex
				position='sticky'
				top={0}
				zIndex={20}
				w='full'
				borderBottom='1px solid'
				borderColor='purple.500'
				bg='rgba(18, 0, 17, 0.92)'
				backdropFilter='blur(8px)'
			>
				<Flex w='full' mx='auto'>
					<HomeTopBar authClient={authClient} />
				</Flex>
			</Flex>

			<Flex layerStyle='main' gap={4} direction={{ base: 'column', xl: 'row' }} flex='1'>
				<Flex display={{ base: 'none', xl: 'block' }} flexShrink={0} w='260px'>
					<HomeNavigationSidebar />
				</Flex>

				<Flex flex='1' minW={0} direction='column' gap={4} mt={4}>
					<Flex maxW='5xl' w='full' mx='auto' direction='column' gap={4} px={{ base: 0, xl: 0 }}>
						<Grid
							templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 420px' }}
							gap={4}
							alignItems='start'
						>
							<GridItem>
								<HomeMainColumn />
							</GridItem>

							<GridItem>
								<HomeSidebar authClient={authClient} />
							</GridItem>
						</Grid>

						<HomeFooter links={footerLinks} />
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
