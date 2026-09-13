import { institution } from '@Api/institution/endpoints';
import { BaseButton,Surface } from '@BaseComponents';
import { Box, Heading, HStack, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { adminNavigationPreset } from '../../../admin/use-cases/home/navigation';
import { ServiceState } from '../../../services/components/UI';
import { staffNavigationPreset } from '../home/navigation';
export function StaffMyProfilePage() {
	const account = useAuthClientStore((s) => s.authClient);
	const query = useQuery({
		queryKey: ['institution-context', account?.id],
		queryFn: institution.context,
	});
	const data = query.data;
	return (
		<NavigationPageShell
			preset={account?.role === 'admin' ? adminNavigationPreset : staffNavigationPreset}
		>
			<VStack align='stretch' gap={6}>
				<Box>
					<Heading as='h1' fontSize='3xl'>
						Meu perfil
					</Heading>
					<Text color='fg.muted' mt={2}>
						Sua identificação e seu vínculo com a instituição.
					</Text>
				</Box>
				<ServiceState query={query}>
					{data && (
						<>
							<Surface variant='gradient'>
								<HStack gap={5} flexWrap='wrap'>
									<Box
										boxSize={20}
										borderRadius='full'
										bg='action.primarySubtle'
										display='grid'
										placeItems='center'
										fontSize='3xl'
										color='action.primary'
										overflow='hidden'
									>
										{data.avatarUrl ? (
											<Image src={data.avatarUrl} alt='' boxSize='full' objectFit='cover' />
										) : (
											data.name.slice(0, 1)
										)}
									</Box>
									<Box>
										<Text color='action.primary' fontSize='sm'>
											{data.role === 'admin' ? 'Administração' : 'Secretaria'}
										</Text>
										<Heading as='h2' fontSize='2xl'>
											{data.name}
										</Heading>
										<Text mt={1}>{data.email}</Text>
									</Box>
								</HStack>
							</Surface>
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
								{[
									[
										'Instituição',
										data.campus.institution.configured
											? data.campus.institution.name
											: 'Identificação institucional pendente',
									],
									['Campus', data.campus.name],
									['Departamento', data.staffProfile?.department?.name ?? 'Não vinculado'],
									['Situação da conta', 'Ativa'],
								].map(([label, value]) => (
									<Surface variant='panel' key={label}>
										<Text fontSize='sm' color='fg.muted'>
											{label}
										</Text>
										<Text mt={2} fontWeight='semibold'>
											{value}
										</Text>
									</Surface>
								))}
							</SimpleGrid>
							<Text color='fg.muted' fontSize='sm'>
								A administração mantém os dados de identificação e os vínculos profissionais.
							</Text>
							{data.role === 'admin' && (
								<BaseButton asChild variant='secondary' w='fit-content'>
									<Link to={'/admin/users/' + data.id}>Atualizar cadastro</Link>
								</BaseButton>
							)}
						</>
					)}
				</ServiceState>
			</VStack>
		</NavigationPageShell>
	);
}
