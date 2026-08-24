import { Surface } from '@BaseComponents';
import { Box, HStack, Icon, Link, Text, VStack } from '@chakra-ui/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useColorModeValue } from '../ui/color-mode';

import type { NavigationLink } from './types';

type NavigationSidebarProps = {
	links: NavigationLink[];
	initialActive?: string;
	onLinkClick?: () => void;
};

export function NavigationSidebar({ links, initialActive, onLinkClick }: NavigationSidebarProps) {
	const firstVisible = links.find((link) => !link.hidden)?.label ?? '';
	const [activeItem, setActiveItem] = useState(initialActive ?? firstVisible);
	const panelBg = useColorModeValue('rgba(255,255,255,0.98)', 'surface');
	const itemActiveBg = useColorModeValue('rgba(37,99,235,0.12)', 'transparent');
	const itemHoverBg = useColorModeValue('rgba(37,99,235,0.08)', 'transparent');
	const itemActiveColor = useColorModeValue('blue.700', 'text');

	return (
		<Surface
			variant='panel'
			h='full'
			px={{ base: 3, md: 4 }}
			py={4}
			overflow='hidden'
			borderRadius={0}
			borderColor='border'
			borderTop='0'
			bg={panelBg}
		>
			<VStack align='stretch' gap={1} h='full' p={0}>
				{links
					.filter((link) => !link.hidden)
					.map(({ label, to, icon }) => {
						const isActive = activeItem === label;

						return (
							<Link
								asChild
								key={label}
								variant='nav'
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
										px={4}
										py={3}
										borderRadius='sm'
										bg={isActive ? itemActiveBg : 'transparent'}
										border='1px solid'
										borderColor={isActive ? 'borderHover' : 'transparent'}
										color={isActive ? itemActiveColor : 'textMuted'}
										cursor='pointer'
										transition='all 0.2s ease'
										transform='translateX(0)'
										_hover={{
											bg: itemHoverBg,
											color: itemActiveColor,
										}}
									>
										<HStack gap={2}>
											{icon ? <Icon as={icon} boxSize={3.5} opacity={0.85} /> : null}
											<Text textStyle='smaller' fontWeight={isActive ? 'medium' : 'normal'} color='inherit'>
												{label}
											</Text>
										</HStack>
										<Box as={ChevronRight} boxSize={3} opacity={0.55} color='inherit' />
									</HStack>
								</NavLink>
							</Link>
						);
					})}
			</VStack>
		</Surface>
	);
}
