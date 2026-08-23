import { Surface } from '@BaseComponents';
import { Box, Button, Flex, Grid, Heading, Text, VStack } from '@chakra-ui/react';

export function StudentCalendarCard() {
	const calendarDays = [
		['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
		['26', '27', '28', '29', '30', '31', '1'],
		['2', '3', '4', '5', '6', '7', '8'],
		['9', '10', '11', '12', '13', '14', '15'],
		['16', '17', '18', '19', '20', '21', '22'],
		['23', '24', '25', '26', '27', '28', '29'],
		['30', '31', '1', '2', '3', '4', '5'],
	];

	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }}>
			<Heading as='h3' textStyle='h6' mb={4}>
				Calendário Acadêmico
			</Heading>
			<VStack align='stretch' gap={2}>
				<Flex justify='space-between' align='center'>
					<Button size='xs' variant='ghost'>
						←
					</Button>
					<Text textStyle='smaller' fontWeight='bold'>
						Agosto 2026
					</Text>
					<Button size='xs' variant='ghost'>
						→
					</Button>
				</Flex>

				<Grid templateColumns='repeat(7, minmax(0, 1fr))' gap={1} fontSize='xs' textAlign='center'>
					{calendarDays.flat().map((day: string, index: number) => (
						<Box
							key={`${day}-${index}`}
							py={2}
							borderRadius='full'
							bg={day === '17' ? 'blue.600' : 'transparent'}
							color={day === '17' ? 'white' : 'pink.100'}
							fontWeight={day === '17' ? 'bold' : 'normal'}
						>
							{day}
						</Box>
					))}
				</Grid>
			</VStack>
		</Surface>
	);
}
