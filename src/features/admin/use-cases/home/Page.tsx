import { Box, Heading, Text } from '@chakra-ui/react';
import { componentColors } from '@core/components';
import { NavigationPageShell } from '@core/components/navigation';

import { adminNavigationPreset } from './navigation';

export function AdminHomePage() {
	return (
		<NavigationPageShell preset={adminNavigationPreset}>
			<Box
				display='flex'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
				minH='40vh'
				textAlign='center'
				gap={3}
			>
				<Heading as='h2' fontSize='clamp(1.25rem, 2vw, 1.65rem)' lineHeight='1.2' fontWeight='700'>
					Você fez login como admin
				</Heading>
				<Text
					fontSize='1rem'
					lineHeight='1.7rem'
					color={componentColors.light.textMuted}
					_dark={{ color: componentColors.dark.textMuted }}
				>
					Esta página está vazia por enquanto.
				</Text>
			</Box>
		</NavigationPageShell>
	);
}
