import { Box, Flex } from '@chakra-ui/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

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
	const [mobileNavHeight, setMobileNavHeight] = useState(0);
	const mobileNavRef = useRef<HTMLDivElement | null>(null);
	const desktopNavTop = { base: 0, xl: '65px' };
	const desktopNavLeft = { xl: 0 };

	useEffect(() => {
		if (!mobileNavRef.current) return;

		setMobileNavHeight(mobileNavRef.current.scrollHeight);
	}, [preset.links, mobileNavOpen]);

	return (
		<Flex
			as='main'
			layerStyle='main'
			minH='100%'
			direction='column'
			px={{ base: 0, md: 0, xl: 0 }}
			pb={{ base: 'calc(24px + env(safe-area-inset-bottom, 0px))', md: 10 }}
		>
			<Flex position='sticky' top={0} zIndex={20} w='full' backdropFilter='blur(14px)'>
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
				maxH={mobileNavOpen ? `${mobileNavHeight}px` : '0px'}
				opacity={mobileNavOpen ? 1 : 0}
				transform={mobileNavOpen ? 'translateY(0)' : 'translateY(-8px)'}
				transition='max-height 0.28s ease, opacity 0.2s ease, transform 0.2s ease'
				pointerEvents={mobileNavOpen ? 'auto' : 'none'}
			>
				<Box ref={mobileNavRef}>
					<NavigationSidebar
						links={preset.links}
						onLinkClick={() => setMobileNavOpen(false)}
						showThemeControl
					/>
				</Box>
			</Box>

			<Flex
				layerStyle='main'
				flex='1'
				direction='column'
				display='flex'
				gap={0}
				px={{ base: 0, xl: 0 }}
				align='stretch'
			>
				<Box
					display={{ base: 'none', xl: 'block' }}
					position='relative'
					h={0}
					w={0}
					overflow='visible'
				>
					<Box
						position='fixed'
						top={desktopNavTop}
						left={desktopNavLeft}
						h='calc(100dvh - 64px)'
						w={sidebarWidth}
						overflow='hidden'
					>
						<NavigationSidebar
							links={preset.links}
							onLinkClick={() => setMobileNavOpen(false)}
							showThemeControl
						/>
					</Box>
				</Box>

				<Flex
					flex='1'
					minW={0}
					w='full'
					justify='center'
					pl={{ xl: `calc(${sidebarWidth} + 24px)` }}
					pt={{ xl: 0 }}
				>
					<Flex
						w='full'
						maxW={{ base: '100%', xl: '1280px' }}
						direction='column'
						gap={{ base: 3, md: 4 }}
						mt={4}
						px={{ base: 4, md: 6, xl: 6 }}
						align='stretch'
					>
						{children}
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
