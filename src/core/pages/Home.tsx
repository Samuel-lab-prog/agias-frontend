import { Surface } from '@BaseComponents';
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export function HomePage() {
	return (
		<Flex
			as='main'
			layerStyle='mainPadded'
			flex='1'
			minH='100%'
			align='center'
			justify='center'
		>
			<Surface variant='elevated' p={{ base: 5, md: 8 }} w='full' maxW='3xl'>
				<VStack align='start' gap={4}>
					<Box>
						<Text
							textStyle='small'
							color='pink.200'
							fontWeight='semibold'
							letterSpacing='0.08em'
						>
							AGIAS
						</Text>
						<Heading as='h1' textStyle={{ base: 'h3', md: 'h2' }} mt={1}>
							Página inicial
						</Heading>
						<Text mt={2} textStyle='small' color='pink.100'>
							Você já está autenticado. A partir daqui, o sistema pode direcionar você para os módulos acadêmicos.
						</Text>
					</Box>

					<Button asChild variant='solidPink'>
						<NavLink to='/login'>Ir para o login</NavLink>
					</Button>
				</VStack>
			</Surface>
		</Flex>
	);
}
