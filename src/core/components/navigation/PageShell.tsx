/* eslint-disable simple-import-sort/imports */
import { Box, Flex } from '@chakra-ui/react';
import { type ReactNode, useState } from 'react';

import { NavigationSidebar } from './Sidebar';
import { NavigationTopBar } from './TopBar';
import type { NavigationPreset } from './types';

type NavigationPageShellProps = {
	preset: NavigationPreset;
	children: ReactNode;
	sidebarWidth?: string;
	rightContent?: ReactNode;
};

export function NavigationPageShell({
	preset,
	children,
	sidebarWidth = '312px',
	rightContent,
}: NavigationPageShellProps) {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const desktopNavTop = { base: 0, xl: '72px' };

	return (
			<Flex
				as='main'
				layerStyle='main'
				minH='100%'
				direction='column'
				px={{ base: 0, md: 0 }}
				pb={{ base: 'calc(24px + env(safe-area-inset-bottom, 0px))', md: 10 }}
				bg='background'
			>
			<Flex
				position='sticky'
				top={0}
				zIndex={20}
				w='full'
				backdropFilter='blur(14px)'
			>
				<NavigationTopBar
					title={preset.title}
					subtitle={preset.subtitle}
					rightContent={rightContent}
					onMenuClick={() => setMobileNavOpen((value) => !value)}
				/>
			</Flex>

			<Box
				display={{ xl: 'none' }}
				px={{ base: 3, md: 4, xl: 0 }}
				pt={3}
				overflow='hidden'
				maxH={mobileNavOpen ? '420px' : '0px'}
				opacity={mobileNavOpen ? 1 : 0}
				transform={mobileNavOpen ? 'translateY(0)' : 'translateY(-8px)'}
				transition='max-height 0.28s ease, opacity 0.2s ease, transform 0.2s ease'
				pointerEvents={mobileNavOpen ? 'auto' : 'none'}
			>
				<NavigationSidebar
					links={preset.links}
					onLinkClick={() => setMobileNavOpen(false)}
					showThemeControl
				/>
			</Box>

			<Flex
				layerStyle='main'
				flex='1'
				direction='column'
				display={{ base: 'flex', xl: 'grid' }}
				gridTemplateColumns={{ xl: `${sidebarWidth} minmax(0, 1fr)` }}
				gap={4}
				align='stretch'
			>
				<Box display={{ base: 'none', xl: 'block' }} alignSelf='start'>
					<Box
						position='sticky'
						top={desktopNavTop}
						h='calc(100dvh - 72px)'
						w='full'
					>
						<NavigationSidebar
							links={preset.links}
							onLinkClick={() => setMobileNavOpen(false)}
							showThemeControl
						/>
					</Box>
				</Box>

				<Flex flex='1' minW={0} w='full' justify='center'>
					<Flex
						w='full'
						maxW={{ base: '100%', xl: '1380px' }}
						direction='column'
						gap={{ base: 3, md: 4 }}
						mt={4}
						px={{ base: 3, md: 4, xl: 0 }}
						align='stretch'
					>
						{children}
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
