import { componentRadii, ErrorStateCard } from '@BaseComponents';
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
			bg='linear-gradient(180deg, #020617, #0f172a)'
			color='#f8fafc'
			direction='column'
			gap={6}
			maxW='4xl'
			mx='auto'
			w='full'
		>
			<Box
				p={6}
				borderRadius={componentRadii.xl}
				border='1px solid'
				borderColor='rgba(255, 255, 255, 0.18)'
				bg='linear-gradient(135deg, rgba(19, 26, 48, 0.98), rgba(10, 10, 16, 0.98))'
			>
				<Box mb={4}>
					<Badge bg='rgba(34, 211, 238, 0.14)' color='#67e8f9' mb={3}>
						Feature staff
					</Badge>
					<Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold'>
						Perfil de staff
					</Text>
					<Text fontSize='0.875rem' lineHeight='1.4rem' color='rgba(255, 255, 255, 0.72)' mt={2}>
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
							borderRadius={componentRadii.xl}
							border='1px solid'
							borderColor='rgba(255, 255, 255, 0.18)'
							bg='rgba(0, 0, 0, 0.24)'
						>
							<BadgeInfo size={18} />
							<Text
								fontSize='0.875rem'
								lineHeight='1.4rem'
								mt={2}
								color='rgba(255, 255, 255, 0.72)'
							>
								ID do perfil
							</Text>
							<Text fontSize='2xl' fontWeight='bold'>
								{isLoading ? '...' : (profile?.id ?? '-')}
							</Text>
						</Box>

						<Box
							p={4}
							borderRadius={componentRadii.xl}
							border='1px solid'
							borderColor='rgba(255, 255, 255, 0.18)'
							bg='rgba(0, 0, 0, 0.24)'
						>
							<ShieldCheck size={18} />
							<Text
								fontSize='0.875rem'
								lineHeight='1.4rem'
								mt={2}
								color='rgba(255, 255, 255, 0.72)'
							>
								ID do usuário
							</Text>
							<Text fontSize='2xl' fontWeight='bold'>
								{isLoading ? '...' : (profile?.userId ?? '-')}
							</Text>
						</Box>

						<Box
							p={4}
							borderRadius={componentRadii.xl}
							border='1px solid'
							borderColor='rgba(255, 255, 255, 0.18)'
							bg='rgba(0, 0, 0, 0.24)'
						>
							<Building2 size={18} />
							<Text
								fontSize='0.875rem'
								lineHeight='1.4rem'
								mt={2}
								color='rgba(255, 255, 255, 0.72)'
							>
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
