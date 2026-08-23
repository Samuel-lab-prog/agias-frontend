import { Surface } from '@BaseComponents';
import { Box, HStack, Icon, Link, Text, VStack } from '@chakra-ui/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import type { NavigationLink } from './types';

type NavigationSidebarProps = {
	links: NavigationLink[];
	initialActive?: string;
};

export function NavigationSidebar({ links, initialActive }: NavigationSidebarProps) {
	const firstVisible = links.find((link) => !link.hidden)?.label ?? '';
	const [activeItem, setActiveItem] = useState(initialActive ?? firstVisible);

	return (
		<Surface
			variant='panel'
			h='full'
			px={{ base: 4, md: 5 }}
			py={0}
			overflow='hidden'
			borderRadius={0}
			borderColor='purple.500'
			borderTop='0'
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
									onClick={() => setActiveItem(label)}
									style={{
										display: 'block',
										textDecoration: 'none',
									}}
								>
									<HStack
										justify='space-between'
										align='center'
										px={3}
										py={2.5}
										borderRadius={0}
										bg={isActive ? 'rgba(255,255,255,0.06)' : 'transparent'}
										border='1px solid'
										borderColor={isActive ? 'borderHover' : 'transparent'}
										color={isActive ? 'pink.50' : 'pink.100'}
										cursor='pointer'
										transition='all 0.2s ease'
										transform={isActive ? 'translateX(2px)' : 'translateX(0)'}
										_hover={{
											bg: 'rgba(255,255,255,0.05)',
											color: 'pink.50',
											transform: 'translateX(2px)',
										}}
									>
										<HStack gap={2}>
											{icon ? <Icon as={icon} boxSize={4} /> : null}
											<Text textStyle='smaller' fontWeight={isActive ? 'semibold' : 'normal'}>
												{label}
											</Text>
										</HStack>
										<Box as={ChevronRight} boxSize={3.5} />
									</HStack>
								</NavLink>
							</Link>
						);
					})}
			</VStack>
		</Surface>
	);
}
