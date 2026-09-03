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
	sidebarWidth = 'sizes.sidebar',
	rightContent,
}: NavigationPageShellProps) {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [mobileNavHeight, setMobileNavHeight] = useState(0);
	const mobileNavRef = useRef<HTMLDivElement | null>(null);
	const topBarHeight = 'sizes.topBar';

	useEffect(() => {
		if (!mobileNavRef.current) return;

		setMobileNavHeight(mobileNavRef.current.scrollHeight);
	}, [preset.links, mobileNavOpen]);

	return (
		<Flex
			as='main'
			bg='bg.canvas'
			color='fg.default'
			minH='100dvh'
			direction='column'
			px={{ base: 0, md: 0, xl: 0 }}
			pb={{ base: 'calc(24px + env(safe-area-inset-bottom, 0px))', md: 10 }}
		>
			<Flex
				position='sticky'
				top={0}
				zIndex={20}
				w='full'
				minH={{ xl: topBarHeight }}
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
				flex='1'
				direction={{ base: 'column', xl: 'row' }}
				display='flex'
				gap={0}
				px={{ base: 0, xl: 0 }}
				align='stretch'
				minH={{ xl: 'calc(100dvh - token(sizes.topBar))' }}
			>
				<Box
					display={{ base: 'none', xl: 'block' }}
					flex={`0 0 ${sidebarWidth}`}
					w={sidebarWidth}
					alignSelf='stretch'
				>
					<Box
						position='sticky'
						top={topBarHeight}
						h='calc(100dvh - token(sizes.topBar))'
						w='full'
						overflow='hidden'
					>
						<NavigationSidebar
							links={preset.links}
							onLinkClick={() => setMobileNavOpen(false)}
							showThemeControl
						/>
					</Box>
				</Box>

				<Flex flex='1' minW={0} w='full' justify='center' pl={0} pt={{ xl: 0 }}>
					<Flex
						w='full'
						maxW={{ base: '100%', xl: 'sizes.content' }}
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
