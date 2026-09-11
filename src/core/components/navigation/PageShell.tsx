import { Box, Flex, Grid } from '@chakra-ui/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { foundations } from '../../themes/foundations';
import { interactionTransition, pageEntry } from '../../themes/motion';
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
	sidebarWidth = foundations.sizes.sidebar,
	rightContent,
}: NavigationPageShellProps) {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [mobileNavHeight, setMobileNavHeight] = useState(0);
	const mobileNavRef = useRef<HTMLDivElement | null>(null);
	const topBarHeight = foundations.sizes.topBar;
	const { pathname } = useLocation();
	const previousPath = useRef(pathname);
	const contentRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (previousPath.current === pathname) return;
		previousPath.current = pathname;
		window.scrollTo({ top: 0, behavior: 'instant' });
		contentRef.current?.focus({ preventScroll: true });
	}, [pathname]);

	useEffect(() => {
		if (!mobileNavOpen) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setMobileNavOpen(false);
				document.getElementById('navigation-toggle')?.focus();
			}
		};
		const onPointer = (event: PointerEvent) => {
			if (
				event.target instanceof Node &&
				!mobileNavRef.current?.contains(event.target) &&
				!document.getElementById('navigation-toggle')?.contains(event.target)
			)
				setMobileNavOpen(false);
		};
		document.addEventListener('keydown', onKey);
		document.addEventListener('pointerdown', onPointer);
		return () => {
			document.removeEventListener('keydown', onKey);
			document.removeEventListener('pointerdown', onPointer);
		};
	}, [mobileNavOpen]);

	useEffect(() => {
		if (!mobileNavRef.current) return;

		setMobileNavHeight(mobileNavRef.current.scrollHeight);
	}, [preset.links, mobileNavOpen]);

	return (
		<Flex
			as='main'
			bg='bg.canvas'
			color='fg.default'
			position='relative'
			minH='100dvh'
			direction='column'
			overflowX='clip'
			px={{ base: 0, md: 0, xl: 0 }}
			pb={{ base: 'calc(24px + env(safe-area-inset-bottom, 0px))', md: 10 }}
		>
			<Box
				asChild
				position='fixed'
				top='-60px'
				left={4}
				zIndex={100}
				bg='action.primary'
				color='fg.inverted'
				px={4}
				py={3}
				borderRadius='md'
				_focus={{ top: 3 }}
			>
				<a href='#page-content'>Pular para o conteúdo</a>
			</Box>
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
					menuOpen={mobileNavOpen}
				/>
			</Flex>

			<Box
				id='mobile-navigation'
				display={{ xl: 'none' }}
				position='fixed'
				top={topBarHeight}
				left={0}
				right={0}
				zIndex={19}
				px={{ base: 3, md: 4, xl: 0 }}
				pt={3}
				pb={mobileNavOpen ? 3 : 0}
				overflowY='auto'
				maxH={
					mobileNavOpen ? `min(${mobileNavHeight + 24}px, calc(100dvh - ${topBarHeight}))` : '0px'
				}
				opacity={mobileNavOpen ? 1 : 0}
				transform={mobileNavOpen ? 'translateY(0)' : 'translateY(-8px)'}
				transition={interactionTransition}
				_motionReduce={{ transform: 'none', transition: 'none' }}
				pointerEvents={mobileNavOpen ? 'auto' : 'none'}
				inert={!mobileNavOpen}
				aria-hidden={!mobileNavOpen}
			>
				<Box ref={mobileNavRef}>
					<NavigationSidebar
						links={preset.links}
						onLinkClick={() => setMobileNavOpen(false)}
						showThemeControl
					/>
				</Box>
			</Box>

			<Grid
				flex='1'
				display='grid'
				gridTemplateColumns={{ base: 'minmax(0, 1fr)', xl: `${sidebarWidth} minmax(0, 1fr)` }}
				gap={0}
				minH={{ xl: `calc(100dvh - ${topBarHeight})` }}
			>
				<Box display={{ base: 'none', xl: 'block' }} w={sidebarWidth}>
					<Box
						position='fixed'
						top={topBarHeight}
						bottom={0}
						left={0}
						zIndex={10}
						w={sidebarWidth}
						boxSizing='border-box'
						overflowY='auto'
						overflowX='hidden'
					>
						<NavigationSidebar
							links={preset.links}
							onLinkClick={() => setMobileNavOpen(false)}
							showThemeControl
						/>
					</Box>
				</Box>

				<Flex minW={0} w='full' justify='center' pl={0} pt={{ xl: 0 }}>
					<Flex
						key={pathname}
						ref={contentRef}
						id='page-content'
						tabIndex={-1}
						css={pageEntry}
						_focus={{ outline: 'none' }}
						w='full'
						maxW={{ base: '100%', xl: foundations.sizes.content }}
						boxSizing='border-box'
						direction='column'
						gap={{ base: 3, md: 4 }}
						mt={4}
						px={{ base: 4, md: 6, xl: 6 }}
						align='stretch'
					>
						{children}
					</Flex>
				</Flex>
			</Grid>
		</Flex>
	);
}
