import { Surface } from '@BaseComponents';
import { Flex, Heading, HStack, Icon, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import type { NavigationAction } from './types';

type NavigationTopBarProps = {
	title?: string;
	action?: NavigationAction;
	subtitle?: string;
};

export function NavigationTopBar({
	title = 'AGIAS',
	subtitle,
	action = { label: 'Sair', to: '/login' },
}: NavigationTopBarProps) {
	return (
		<Surface
			variant='panel'
			px={{ base: 4, md: 8 }}
			py={{ base: 3.5, md: 4 }}
			w='full'
			borderRadius={0}
		>
			<Flex align='center' justify='space-between' gap={3} wrap='wrap'>
				<HStack gap={3} align='center'>
					<Heading as='h1' textStyle='h6'>
						{title}
					</Heading>
					{subtitle ? (
						<Text textStyle='xs' color='pink.200' display={{ base: 'none', md: 'block' }}>
							{subtitle}
						</Text>
					) : null}
				</HStack>

				<NavLink to={action.to}>
					<HStack
						px={3}
						py={2}
						borderRadius='full'
						border='1px solid'
						borderColor='border'
						_hover={{ bg: 'rgba(255,255,255,0.05)' }}
					>
						{action.icon ? <Icon as={action.icon} boxSize={4} /> : null}
						<Text textStyle='xs'>{action.label}</Text>
					</HStack>
				</NavLink>
			</Flex>
		</Surface>
	);
}
