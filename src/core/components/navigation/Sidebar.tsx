import { Surface } from '@BaseComponents';
import { Box, ClientOnly, HStack, Icon, Link, Switch, Text, VStack } from '@chakra-ui/react';
import { ChevronRight } from 'lucide-react';
import { LuMoon } from 'react-icons/lu';
import { NavLink, useLocation } from 'react-router-dom';

import { hoverNav } from '../../utils/interaction';
import { useColorMode } from '../ui/color-mode';
import type { NavigationLink } from './types';

type NavigationSidebarProps = {
	links: NavigationLink[];
	onLinkClick?: () => void;
	showThemeControl?: boolean;
};

function SidebarThemeControl() {
	const { colorMode, toggleColorMode } = useColorMode();
	const isDark = colorMode === 'dark';

	return (
		<Box mt='auto' pt={4}>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				gap={3}
				px='1rem'
				py='0.75rem'
				border='none'
				borderRadius='xl'
				bg='bg.surface'
				_dark={{ bg: 'bg.surface' }}
			>
				<HStack gap={3} minW={0}>
					<Icon as={LuMoon} boxSize={4} opacity={0.9} />
					<Text
						fontSize='0.8125rem'
						lineHeight='1.25rem'
						color='fg.default'
						_dark={{ color: 'fg.default' }}
					>
						Tema escuro
					</Text>
				</HStack>
				<HStack gap={3}>
					<Switch.Root
						checked={isDark}
						onCheckedChange={(details) => {
							if (details.checked !== isDark) {
								toggleColorMode();
							}
						}}
					>
						<Switch.HiddenInput />
						<Switch.Control>
							<Switch.Thumb />
						</Switch.Control>
					</Switch.Root>
				</HStack>
			</Box>
		</Box>
	);
}

export function NavigationSidebar({
	links,
	onLinkClick,
	showThemeControl = false,
}: NavigationSidebarProps) {
	const { pathname } = useLocation();
	const navMotion = hoverNav();
	const { colorMode } = useColorMode();
	const isDark = colorMode === 'dark';
	const activeBg = isDark ? 'action.primarySubtle' : 'action.primarySubtle';
	const activeBorder = isDark ? 'border.interactive' : 'border.interactive';
	const activeColor = isDark ? 'action.primary' : 'action.primaryStrong';
	const hoverBg = isDark ? 'bg.muted' : 'bg.surface';
	const hoverColor = isDark ? 'fg.default' : 'fg.default';
	const hoverBorder = isDark ? 'border.interactive' : 'border.interactive';
	const visibleLinks = links.filter((link) => !link.hidden);
	const matchesPath = (link: NavigationLink) =>
		link.to === '/student'
			? pathname === link.to
			: pathname === link.to || pathname.startsWith(`${link.to}/`);
	const activeLink = visibleLinks.find(matchesPath);

	return (
		<Surface
			variant='sidebar'
			h='full'
			overflowX='hidden'
			overflowY='auto'
			borderRadius={0}
			borderTop='0'
		>
			<VStack align='stretch' gap={1} h='full' p={0}>
				{visibleLinks.map((link) => {
						const { label, to, icon } = link;
						const isActive = activeLink === link;

						return (
							<Link
								asChild
								key={label}
								display='block'
								px={0}
								py={0}
								borderRadius={0}
								_hover={{ textDecoration: 'none' }}
							>
								<NavLink
									to={to}
									onClick={() => onLinkClick?.()}
									style={{
										display: 'block',
										textDecoration: 'none',
									}}
								>
									<HStack
										justify='space-between'
										align='center'
										px='1.25rem'
										py='1rem'
										minH='56px'
										borderRadius='md'
										bg={isActive ? activeBg : 'transparent'}
										border='1px solid'
										borderColor={isActive ? activeBorder : 'transparent'}
										color={isActive ? activeColor : isDark ? 'fg.muted' : 'fg.muted'}
										cursor='pointer'
										transition={navMotion.transition}
										transform='translateX(0)'
										_hover={{
											bg: hoverBg,
											borderColor: hoverBorder,
											color: hoverColor,
											transform: navMotion.hover.transform,
										}}
										_active={navMotion.active}
										_focusVisible={{
											...navMotion.focusVisible,
											color: hoverColor,
										}}
									>
										<HStack gap={2}>
											{icon ? <Icon as={icon} boxSize={5} opacity={0.85} /> : null}
											<Text
												fontSize='0.875rem'
												lineHeight='1.4rem'
												fontWeight={isActive ? 'medium' : 'normal'}
												color='inherit'
											>
												{label}
											</Text>
										</HStack>
										<Box as={ChevronRight} boxSize={3} opacity={0.55} color='inherit' />
									</HStack>
								</NavLink>
							</Link>
						);
					})}
				{showThemeControl ? (
					<ClientOnly>
						<SidebarThemeControl />
					</ClientOnly>
				) : null}
			</VStack>
		</Surface>
	);
}
