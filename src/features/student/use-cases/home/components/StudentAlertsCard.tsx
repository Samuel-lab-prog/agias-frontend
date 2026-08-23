import { Surface } from '@BaseComponents';
import { Box, Button, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { Bell } from 'lucide-react';

export function StudentAlertsCard() {
	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }}>
			<Flex align='center' justify='space-between' gap={4} wrap='wrap'>
				<HStack gap={3}>
					<Box boxSize={12} borderRadius='xl' display='grid' placeItems='center' bg='rgba(255,255,255,0.06)'>
						<Bell size={24} />
					</Box>
					<Box>
						<Heading as='h2' textStyle='h5'>
							Não há notícias cadastradas.
						</Heading>
						<Text textStyle='smaller' color='pink.100' mt={1}>
							Fique atento aos avisos e comunicados da sua instituição.
						</Text>
					</Box>
				</HStack>

				<Button size='sm' variant='outline' color='pink.100' borderColor='border'>
					Ver todas as notícias
				</Button>
			</Flex>
		</Surface>
	);
}
