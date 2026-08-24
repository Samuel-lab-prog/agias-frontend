import { Surface } from '@BaseComponents';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { LoginForm } from './components/LoginForm';

function HeaderCard() {
	return (
		<Surface variant='elevated' p={{ base: 4, md: 6 }}>
			<VStack align='stretch' gap={3}>
				<Box>
					<Text textStyle='small' color='accent' fontWeight='semibold' letterSpacing='0.08em'>
						AGIAS - Aplicação de Gestão Integrada Acadêmica e de Serviços
					</Text>
					<Heading as='h1' textStyle={{ base: 'h3', md: 'h2' }} color='accent' mt={1}>
						Acesso ao sistema
					</Heading>
					<Text mt={2} textStyle='small' color='textMuted'>
						Entre com seu usuário e senha para acessar o sistema.
					</Text>
				</Box>
			</VStack>
		</Surface>
	);
}

function LoginPanel() {
	return (
		<Surface
			variant='elevated'
			p={{ base: 4, md: 6 }}
			w='full'
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
		>
			<VStack align='stretch' gap={4} w='full' alignItems='center' justifyContent='center'>
				<Box>
					<Heading as='h2' textStyle='h4' textAlign='center'>
						Entrar no sistema
					</Heading>
					<Text mt={1} textStyle='small' color='textMuted' textAlign='center'>
						Digite seu usuário e senha para continuar.
					</Text>
				</Box>

				<LoginForm />
			</VStack>
		</Surface>
	);
}

export function LoginPage() {
	return (
		<Flex
			as='main'
			layerStyle='mainPadded'
			flex='1'
			minH='100%'
			direction='column'
			align='center'
			overflowY='auto'
			scrollbarGutter='stable'
		>
			<Flex as='section' direction='column' align='stretch' gap={5} w='full' maxW='2xl' mx='auto'>
				<HeaderCard />
				<LoginPanel />
			</Flex>
		</Flex>
	);
}
