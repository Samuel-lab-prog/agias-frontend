import { Box, Heading, Text } from '@chakra-ui/react';
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
				<Heading as='h2' textStyle='h4'>
					Você fez login como admin
				</Heading>
				<Text textStyle='body' color='textMuted'>
					Esta página está vazia por enquanto.
				</Text>
			</Box>
		</NavigationPageShell>
	);
}
