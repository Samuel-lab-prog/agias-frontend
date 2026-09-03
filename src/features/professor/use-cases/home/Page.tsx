import { Box, Heading, Text } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';

import { professorNavigationPreset } from './navigation';

export function ProfessorHomePage() {
	return (
		<NavigationPageShell preset={professorNavigationPreset}>
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
					Você fez login como professor
				</Heading>
				<Text fontSize='1rem' lineHeight='1.7rem' color={'fg.muted'} _dark={{ color: 'fg.muted' }}>
					Esta página está vazia por enquanto.
				</Text>
			</Box>
		</NavigationPageShell>
	);
}
