import { Box, Heading, Text } from '@chakra-ui/react';
import { NavigationPageShell, professorNavigationPreset } from '@core/components/navigation';

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
				<Heading as='h2' textStyle='h4'>
					Você fez login como professor
				</Heading>
				<Text textStyle='body' color='pink.100'>
					Esta página está vazia por enquanto.
				</Text>
			</Box>
		</NavigationPageShell>
	);
}
