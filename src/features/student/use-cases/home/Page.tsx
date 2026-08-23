import { Box, Heading, Text } from '@chakra-ui/react';
import { NavigationPageShell, studentNavigationPreset } from '@core/components/navigation';

export function StudentHomePage() {
	return (
		<NavigationPageShell preset={studentNavigationPreset}>
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
					Você fez login como student
				</Heading>
				<Text textStyle='body' color='pink.100'>
					Esta página está vazia por enquanto.
				</Text>
			</Box>
		</NavigationPageShell>
	);
}
