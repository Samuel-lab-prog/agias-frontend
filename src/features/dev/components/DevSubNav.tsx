import { componentColors, componentRadii, Surface } from '@BaseComponents';
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
				<Text
					fontSize='sm'
					fontWeight='semibold'
					color={componentColors.light.textMuted}
					mr={2}
					_dark={{ color: componentColors.dark.textMuted }}
				>
					Dev
				</Text>
				{devNavItems.map((item) => {
					const isActive = pathname === item.to;

					return (
						<Flex
							asChild
							key={item.to}
							px={3}
							py={2}
							border='1px solid'
							borderColor={isActive ? componentColors.light.accent : componentColors.light.border}
							bg={isActive ? componentColors.light.accentSoft : componentColors.light.background}
							color={isActive ? componentColors.light.text : componentColors.light.textMuted}
							borderRadius={componentRadii.full}
							fontSize='sm'
							fontWeight={isActive ? 'semibold' : 'medium'}
							transition='all 0.18s ease'
							_hover={{
								borderColor: componentColors.light.accent,
								bg: componentColors.light.surface,
								color: componentColors.light.text,
								transform: 'translateY(-1px)',
							}}
							_focusVisible={{
								outline: 'none',
								boxShadow: `0 0 0 4px ${componentColors.light.focusRing}`,
							}}
							_dark={{
								borderColor: isActive ? componentColors.dark.accent : componentColors.dark.border,
								bg: isActive ? componentColors.dark.accentSoft : componentColors.dark.background,
								color: isActive ? componentColors.dark.text : componentColors.dark.textMuted,
								_hover: {
									borderColor: componentColors.dark.accent,
									bg: componentColors.dark.surface,
									color: componentColors.dark.text,
								},
								_focusVisible: {
									boxShadow: `0 0 0 4px ${componentColors.dark.focusRing}`,
								},
							}}
						>
							<Link to={item.to}>{item.label}</Link>
						</Flex>
					);
				})}
			</Flex>
		</Surface>
	);
}
