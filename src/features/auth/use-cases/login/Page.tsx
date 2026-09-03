import { Surface } from '@BaseComponents';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { LoginForm } from './components/LoginForm';

function HeaderCard() {
	return (
		<Surface variant='gradient' p={{ base: 4, md: 5 }}>
			<VStack align='stretch' gap={3}>
				<Box>
					<Text
						fontSize='sm'
						lineHeight='1.25rem'
						color='action.primary'
						fontWeight='semibold'
						letterSpacing='normal'
						_dark={{ color: 'action.primary' }}
					>
						AGIAS - Aplicação de Gestão Integrada Acadêmica e de Serviços
					</Text>
					<Heading
						as='h1'
						fontSize={{ base: '2rem', md: '2.5rem' }}
						lineHeight='1.1'
						fontWeight='700'
						color='action.primary'
						mt={1}
						_dark={{ color: 'action.primary' }}
					>
						Acesso ao sistema
					</Heading>
					<Text
						mt={2}
						fontSize='sm'
						lineHeight='1.4rem'
						color='fg.muted'
						_dark={{ color: 'fg.muted' }}
					>
						Entre com seu usuário e senha para acessar o sistema.
					</Text>
				</Box>
			</VStack>
		</Surface>
	);
}

function LoginPanel() {
	return (
		<VStack align='stretch' gap={4} w='full' alignItems='center' justifyContent='center'>
				<Box>
					<Heading
						as='h2'
						fontSize='xl'
						lineHeight='1.2'
						fontWeight='700'
						textAlign='center'
					>
						Entrar no sistema
					</Heading>
					<Text
						mt={1}
						fontSize='sm'
						lineHeight='1.4rem'
						color='fg.muted'
						textAlign='center'
						_dark={{ color: 'fg.muted' }}
					>
						Digite seu usuário e senha para continuar.
					</Text>
				</Box>

				<LoginForm />
			</VStack>
	);
}

export function LoginPage() {
	return (
		<Flex
			as='main'
			bg='bg.canvas'
			color='fg.default'
			minH='100dvh'
			direction='column'
			align='center'
			justify='center'
			overflowY='auto'
			scrollbarGutter='stable'
			px={{ base: 4, md: 6 }}
			py={{ base: 6, md: 8 }}
			_dark={{
				bg: 'bg.canvas',
				color: 'fg.default',
			}}
		>
			<Flex as='section' direction='column' align='stretch' gap={5} w='full' maxW='md' mx='auto'>
				<HeaderCard />
				<LoginPanel />
			</Flex>
		</Flex>
	);
}
