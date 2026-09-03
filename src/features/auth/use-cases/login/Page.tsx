import { Surface } from '@BaseComponents';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { LoginForm } from './components/LoginForm';

function HeaderCard() {
	return (
		<Surface variant='elevated' p={{ base: 4, md: 6 }}>
			<VStack align='stretch' gap={3}>
				<Box>
					<Text
						fontSize='0.875rem'
						lineHeight='1.4rem'
						color='action.primary'
						fontWeight='semibold'
						letterSpacing='0.08em'
						_dark={{ color: 'action.primary' }}
					>
						AGIAS - Aplicação de Gestão Integrada Acadêmica e de Serviços
					</Text>
					<Heading
						as='h1'
						fontSize={{ base: '1.5rem', md: 'clamp(1.8rem, 3.5vw, 3rem)' }}
						lineHeight={{ base: '1.14', md: '1.08' }}
						fontWeight='800'
						color='action.primary'
						mt={1}
						_dark={{ color: 'action.primary' }}
					>
						Acesso ao sistema
					</Heading>
					<Text
						mt={2}
						fontSize='0.875rem'
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
					<Heading
						as='h2'
						fontSize='clamp(1.25rem, 2vw, 1.65rem)'
						lineHeight='1.2'
						fontWeight='700'
						textAlign='center'
					>
						Entrar no sistema
					</Heading>
					<Text
						mt={1}
						fontSize='0.875rem'
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
		</Surface>
	);
}

export function LoginPage() {
	return (
		<Flex
			as='main'
			bg='bg.canvas'
			color='fg.default'
			flex='1'
			minH='100%'
			direction='column'
			align='center'
			overflowY='auto'
			scrollbarGutter='stable'
			px={{ base: 4, md: 6 }}
			py={{ base: 6, md: 10 }}
			_dark={{
				bg: 'bg.canvas',
				color: 'fg.default',
			}}
		>
			<Flex as='section' direction='column' align='stretch' gap={5} w='full' maxW='2xl' mx='auto'>
				<HeaderCard />
				<LoginPanel />
			</Flex>
		</Flex>
	);
}
