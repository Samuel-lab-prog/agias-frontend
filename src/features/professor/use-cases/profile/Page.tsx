import { teaching } from '@Api/teaching/endpoints';
import { Surface } from '@BaseComponents';
import { Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Building2, GraduationCap, Mail } from 'lucide-react';

import { PageHeader, QueryState, SectionHeading, StatusPill } from '../../components/TeachingUI';
import { useTeachingQuery } from '../../hooks';
import { initials } from '../../utils';

export function ProfilePage() {
	const query = useTeachingQuery(['overview'], teaching.overview);
	const profile = query.data?.profile;
	return (
		<VStack align='stretch' gap={5}>
			<PageHeader
				title='Meu perfil docente'
				description='Seus dados de identificação e vínculo com a instituição.'
			/>
			<QueryState query={query}>
				{profile && (
					<>
						<Surface variant='gradient'>
							<HStack gap={5} align='center' flexWrap='wrap'>
								<Box
									boxSize='80px'
									display='grid'
									placeItems='center'
									borderRadius='2xl'
									bg='action.primarySubtle'
									color='action.primary'
									fontSize='2xl'
									fontWeight='bold'
									flexShrink={0}
									aria-hidden='true'
								>
									{initials(profile.user.name)}
								</Box>
								<Box flex='1' minW='180px'>
									<StatusPill tone='accent'>Professor</StatusPill>
									<Heading as='h2' fontSize='2xl' mt={3} overflowWrap='anywhere'>
										{profile.user.name}
									</Heading>
									<Text color='fg.muted' mt={1}>
										{profile.title || 'Titulação não informada'}
									</Text>
								</Box>
							</HStack>
						</Surface>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<Surface variant='panel'>
								<SectionHeading title='Identificação' />
								<VStack align='stretch' gap={5}>
									<Box>
										<HStack color='fg.muted' fontSize='sm' mb={2}>
											<Mail size={16} aria-hidden='true' />
											<Text>E-mail institucional</Text>
										</HStack>
										<Text fontSize='sm' fontWeight='medium' overflowWrap='anywhere'>
											{profile.user.email}
										</Text>
									</Box>
									<Box>
										<Text color='fg.muted' fontSize='sm' mb={2}>
											Registro docente
										</Text>
										<Text fontWeight='medium'>{profile.registryCode || 'Não informado'}</Text>
									</Box>
								</VStack>
							</Surface>
							<Surface variant='panel'>
								<SectionHeading title='Vínculo acadêmico' />
								<VStack align='stretch' gap={5}>
									<Box>
										<HStack color='fg.muted' fontSize='sm' mb={2}>
											<Building2 size={16} aria-hidden='true' />
											<Text>Departamento</Text>
										</HStack>
										<Text fontWeight='medium'>{profile.department?.name || 'Não informado'}</Text>
									</Box>
									<Box>
										<HStack color='fg.muted' fontSize='sm' mb={2}>
											<GraduationCap size={16} aria-hidden='true' />
											<Text>Titulação</Text>
										</HStack>
										<Text fontWeight='medium'>{profile.title || 'Não informada'}</Text>
									</Box>
								</VStack>
							</Surface>
						</SimpleGrid>
						<Text color='fg.muted' fontSize='sm'>
							Para atualizar seus dados cadastrais, entre em contato com a secretaria.
						</Text>
					</>
				)}
			</QueryState>
		</VStack>
	);
}
