import { ErrorStateCard } from '@BaseComponents';
import { Badge, Box, Flex, Grid, Text } from '@chakra-ui/react';
import { useEnsureRole } from '@features/auth/public';
import { StaffProfileAccessGate } from '@features/staff/public/components/StaffProfileAccessGate';
import { useMyStaffProfile } from '@features/staff/public/hooks/useMyStaffProfile';
import { BadgeInfo, Building2, ShieldCheck } from 'lucide-react';

export function StaffMyProfilePage() {
	const isStaff = useEnsureRole(['staff', 'admin']);
	const { profile, isLoading, isError, error, isMissingClient, refetch } = useMyStaffProfile();

	if (isMissingClient || !isStaff) {
		return <StaffProfileAccessGate />;
	}

	return (
		<Flex
			as='main'
			bg='bg.canvas'
			color='fg.default'
			direction='column'
			gap={6}
			maxW='4xl'
			mx='auto'
			w='full'
		>
			<Box
				p={6}
				borderRadius={'xl'}
				border='1px solid'
				borderColor='border.default'
				bg='bg.surface'
			>
				<Box mb={4}>
					<Badge bg='action.primarySubtle' color='action.primary' mb={3}>
						Feature staff
					</Badge>
					<Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold'>
						Perfil de staff
					</Text>
					<Text fontSize='0.875rem' lineHeight='1.4rem' color='fg.muted' mt={2}>
						Base inicial para páginas e ações de staff.
					</Text>
				</Box>

				{isError ? (
					<ErrorStateCard
						eyebrow='STAFF PROFILE'
						title='Não foi possível carregar o perfil de staff.'
						description={error instanceof Error ? error.message : 'Tente novamente em instantes.'}
						actionLabel='Tentar novamente'
						onAction={() => {
							void refetch();
						}}
					/>
				) : (
					<Grid templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }} gap={4}>
						<Box
							p={4}
							borderRadius={'xl'}
							border='1px solid'
							borderColor='border.default'
							bg='bg.muted'
						>
							<BadgeInfo size={18} />
							<Text fontSize='0.875rem' lineHeight='1.4rem' mt={2} color='fg.muted'>
								ID do perfil
							</Text>
							<Text fontSize='2xl' fontWeight='bold'>
								{isLoading ? '...' : (profile?.id ?? '-')}
							</Text>
						</Box>

						<Box
							p={4}
							borderRadius={'xl'}
							border='1px solid'
							borderColor='border.default'
							bg='bg.muted'
						>
							<ShieldCheck size={18} />
							<Text fontSize='0.875rem' lineHeight='1.4rem' mt={2} color='fg.muted'>
								ID do usuário
							</Text>
							<Text fontSize='2xl' fontWeight='bold'>
								{isLoading ? '...' : (profile?.userId ?? '-')}
							</Text>
						</Box>

						<Box
							p={4}
							borderRadius={'xl'}
							border='1px solid'
							borderColor='border.default'
							bg='bg.muted'
						>
							<Building2 size={18} />
							<Text fontSize='0.875rem' lineHeight='1.4rem' mt={2} color='fg.muted'>
								Departamento
							</Text>
							<Text fontSize='2xl' fontWeight='bold'>
								{isLoading ? '...' : (profile?.departmentId ?? 'Não vinculado')}
							</Text>
						</Box>
					</Grid>
				)}
			</Box>
		</Flex>
	);
}
