import { Box, Heading, Text } from '@chakra-ui/react';
import { NavigationPageShell, staffNavigationPreset } from '@core/components/navigation';

export function StaffHomePage() {
	return (
		<NavigationPageShell preset={staffNavigationPreset}>
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
					Você fez login como staff
				</Heading>
				<Text textStyle='body' color='pink.100'>
					Esta página está vazia por enquanto.
				</Text>
			</Box>
		</NavigationPageShell>
	);
}
