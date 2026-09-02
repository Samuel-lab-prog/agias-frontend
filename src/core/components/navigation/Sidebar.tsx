import { Surface } from '@BaseComponents';
import { Box, ClientOnly, HStack, Icon, Link, Switch, Text, VStack } from '@chakra-ui/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { LuMoon } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';

import { hoverNav } from '../../utils/interaction';
import { componentColors, componentRadii } from '../localStyles';
import { useColorMode } from '../ui/color-mode';
import type { NavigationLink } from './types';

type NavigationSidebarProps = {
	links: NavigationLink[];
	initialActive?: string;
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
				border='1px solid'
				borderColor={componentColors.light.border}
				borderRadius={componentRadii.xl}
				bg={componentColors.light.surface}
				_dark={{
					borderColor: componentColors.dark.border,
					bg: componentColors.dark.surface,
				}}
			>
				<HStack gap={3} minW={0}>
					<Icon as={LuMoon} boxSize={4} opacity={0.9} />
					<Text
						fontSize='0.8125rem'
						lineHeight='1.25rem'
						color={componentColors.light.text}
						_dark={{ color: componentColors.dark.text }}
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
	initialActive,
	onLinkClick,
	showThemeControl = false,
}: NavigationSidebarProps) {
	const firstVisible = links.find((link) => !link.hidden)?.label ?? '';
	const [activeItem, setActiveItem] = useState(initialActive ?? firstVisible);
	const navMotion = hoverNav();
	const { colorMode } = useColorMode();
	const isDark = colorMode === 'dark';
	const activeBg = isDark ? 'rgba(37, 99, 235, 0.28)' : 'rgba(37, 99, 235, 0.06)';
	const activeBorder = isDark ? 'rgba(96, 165, 250, 0.28)' : 'rgba(37, 99, 235, 0.12)';
	const activeColor = isDark ? componentColors.dark.accent : componentColors.light.accentStrong;
	const hoverBg = isDark ? 'rgba(148, 163, 184, 0.08)' : componentColors.light.surface;
	const hoverColor = isDark ? componentColors.dark.text : componentColors.light.text;
	const hoverBorder = isDark ? componentColors.dark.borderHover : componentColors.light.borderHover;

	return (
		<Surface variant='sidebar' h='full' overflow='hidden' borderRadius={0} borderTop='0'>
			<VStack align='stretch' gap={1} h='full' p={0}>
				{links
					.filter((link) => !link.hidden)
					.map(({ label, to, icon }) => {
						const isActive = activeItem === label;

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
									onClick={() => {
										setActiveItem(label);
										onLinkClick?.();
									}}
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
										borderRadius={componentRadii.md}
										bg={isActive ? activeBg : 'transparent'}
										border='1px solid'
										borderColor={isActive ? activeBorder : 'transparent'}
										color={
											isActive
												? activeColor
												: isDark
													? componentColors.dark.textMuted
													: componentColors.light.textMuted
										}
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
