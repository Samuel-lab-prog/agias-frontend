import { Surface } from '@BaseComponents';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import {
	BadgeCent,
	BookOpen,
	ChevronRight,
	Ellipsis,
	Home,
	Library,
	Link2,
	Megaphone,
	Monitor,
	Search,
} from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
	{ label: 'Início', icon: Home },
	{ label: 'Ensino', icon: BookOpen },
	{ label: 'Pesquisa', icon: Search },
	{ label: 'Extensão', icon: Megaphone },
	{ label: 'Ações Associadas', icon: Link2 },
	{ label: 'Biblioteca', icon: Library },
	{ label: 'Bolsas', icon: BadgeCent },
	{ label: 'Ambientes Virtuais', icon: Monitor },
	{ label: 'Outros', icon: Ellipsis },
];

export function HomeNavigationSidebar() {
	const [activeItem, setActiveItem] = useState('Início');

	return (
		<Surface
			variant='panel'
			h='full'
			p={0}
			overflow='hidden'
			borderRadius={0}
			borderColor='purple.500'
			borderTop='0'
		>
			<VStack align='stretch' gap={4} h='full' justify='space-between' p={0}>
				<VStack align='stretch' gap={1} flex='1'>
					{navigationItems.map(({ label, icon: Icon }) => {
						const isActive = activeItem === label;

						return (
							<HStack
								key={label}
								justify='space-between'
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
								onClick={() => setActiveItem(label)}
							>
								<HStack gap={2}>
									<Box as={Icon} boxSize={4} />
									<Text textStyle='smaller' fontWeight={isActive ? 'semibold' : 'normal'}>
										{label}
									</Text>
								</HStack>
								<ChevronRight size={14} />
							</HStack>
						);
					})}
				</VStack>
			</VStack>
		</Surface>
	);
}
