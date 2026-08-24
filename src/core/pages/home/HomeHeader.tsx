import { Surface } from '@BaseComponents';
import { Badge, Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { ArrowRight, Bell } from 'lucide-react';

import type { HomeProps } from './types';

function getRoleLabel(authClient: HomeProps['authClient']) {
	if (!authClient) return 'Acesso autenticado';
	if (authClient.role === 'student') return 'Estudante';
	if (authClient.role === 'professor') return 'Professor';
	if (authClient.role === 'staff') return 'Servidor';
	if (authClient.role === 'admin') return 'Administrador';
	return 'Acesso autenticado';
}

export function HomeHeader({ authClient }: HomeProps) {
	return (
		<Surface variant='gradient' p={{ base: 4, md: 5 }}>
			<Flex
				direction={{ base: 'column', md: 'row' }}
				gap={5}
				justify='space-between'
				align={{ base: 'start', md: 'center' }}
			>
				<VStack align='start' gap={3} maxW='xl'>
					<Box>
						<Badge colorPalette='blue' variant='subtle'>
							{getRoleLabel(authClient)}
						</Badge>
						<Heading as='h2' textStyle={{ base: 'h5', md: 'h4' }} mt={2}>
							Bem-vindo ao sistema acadêmico
						</Heading>
						<Text mt={2} textStyle='smaller' color='textMuted' maxW='lg'>
							Aqui você encontra os principais atalhos da sua rotina institucional, com acesso
							rápido aos módulos que fazem parte do seu perfil.
						</Text>
					</Box>

					<HStack gap={3} flexWrap='wrap'>
						<Button variant='solid'>
							<Bell />
							Avisos
						</Button>
						<Button
							variant='outline'
							color='textMuted'
							borderColor='border'
							_hover={{ bg: 'surface' }}
						>
							<ArrowRight />
							Ver módulo principal
						</Button>
					</HStack>
				</VStack>
			</Flex>
		</Surface>
	);
}
