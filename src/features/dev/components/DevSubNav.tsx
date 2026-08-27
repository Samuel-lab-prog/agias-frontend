import { Surface } from '@BaseComponents';
import { Flex, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const devNavItems = [
	{ label: 'Buttons', to: '/dev/components/buttons' },
	{ label: 'Forms', to: '/dev/components/forms' },
	{ label: 'Colors', to: '/dev/components/colors' },
	{ label: 'Typography', to: '/dev/components/typography' },
	{ label: 'Animations', to: '/dev/components/animations' },
] as const;

export function DevSubNav() {
	const { pathname } = useLocation();

	return (
		<Surface
			variant='panel'
			p={{ base: 3, md: 4 }}
			borderRadius={{ base: 'xl', md: '2xl' }}
			position='sticky'
			top={{ base: 3, md: 4 }}
			zIndex={5}
		>
			<Flex gap={2} wrap='wrap' align='center'>
				<Text fontSize='sm' fontWeight='semibold' color='fg.muted' mr={2}>
					Dev
				</Text>
				{devNavItems.map((item) => {
					const isActive = pathname === item.to;

					return (
						<Flex
							as={Link}
							key={item.to}
							to={item.to}
							px={3}
							py={2}
							border='1px solid'
							borderColor={isActive ? 'accent' : 'border'}
							bg={isActive ? 'accentSoft' : 'background'}
							color={isActive ? 'text' : 'textMuted'}
							borderRadius='full'
							fontSize='sm'
							fontWeight={isActive ? 'semibold' : 'medium'}
							transition='all 0.18s ease'
							_hover={{
								borderColor: 'accent',
								bg: 'surface',
								color: 'text',
								transform: 'translateY(-1px)',
							}}
							_focusVisible={{
								outline: 'none',
								boxShadow: '0 0 0 4px {colors.focusRing}',
							}}
						>
							{item.label}
						</Flex>
					);
				})}
			</Flex>
		</Surface>
	);
}
