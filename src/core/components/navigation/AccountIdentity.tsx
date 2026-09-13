import { institution } from '@Api/institution/endpoints';
import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
const labels: Record<string, string> = {
	staff: 'Secretaria',
	admin: 'Administração',
	professor: 'Professor',
	student: 'Aluno',
};
export function AccountIdentity() {
	const account = useAuthClientStore((s) => s.authClient);
	const query = useQuery({
		queryKey: ['institution-context', account?.id],
		queryFn: institution.context,
		enabled: !!account && account.status === 'active',
		staleTime: 60000,
		retry: false,
	});
	if (!account) return null;
	const profileUrl =
		account.role === 'staff' || account.role === 'admin'
			? '/staff/my-profile'
			: '/' + account.role + '/profile';
	const data = query.data;
	return (
		<Link to={profileUrl} aria-label='Abrir meu perfil'>
			<HStack gap={2}>
				<Box textAlign='right' display={{ base: 'none', sm: 'block' }} maxW='230px'>
					<Text fontSize='sm' fontWeight='semibold' truncate>
						{data?.name ?? 'Meu perfil'}
					</Text>
					<Text fontSize='xs' color='fg.muted' truncate>
						{data?.campus.institution.configured
							? data.campus.institution.acronym + ' · ' + data.campus.name
							: (labels[account.role] ?? account.role)}
					</Text>
				</Box>
				<Box
					boxSize={9}
					borderRadius='full'
					overflow='hidden'
					display='grid'
					placeItems='center'
					bg='action.primarySubtle'
					color='action.primary'
					fontWeight='bold'
				>
					{data?.avatarUrl ? (
						<Image src={data.avatarUrl} alt='' boxSize='full' objectFit='cover' />
					) : (
						(data?.name.slice(0, 1).toUpperCase() ?? '●')
					)}
				</Box>
			</HStack>
		</Link>
	);
}
