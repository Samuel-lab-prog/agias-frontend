import { administration } from '@Api/admin/endpoints';
import { Surface } from '@BaseComponents';
import { HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { ShieldCheck } from 'lucide-react';
import { AdminBadge, AdminHeader, AdminSection, AdminState } from '../../components/AdminUI';
import { useAdminQuery } from '../../hooks';
import { roleLabels } from '../../utils';

export function PermissionsPage() {
	const query = useAdminQuery(['permissions'], administration.permissions);
	return <VStack align='stretch' gap={5}><AdminHeader title='Papéis e permissões' description='Entenda as responsabilidades de cada perfil e os limites de acesso.' /><Surface variant='gradient'><HStack gap={3} color='action.primary' mb={2}><ShieldCheck size={21} aria-hidden='true' /><Text fontWeight='semibold'>Acesso por responsabilidade</Text></HStack><Text fontSize='sm' color='fg.muted'>As permissões são definidas pelo sistema. Para atribuir um papel a uma pessoa, acesse seu cadastro em Usuários e acessos.</Text></Surface><AdminState query={query}><SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>{query.data?.map((item) => <Surface key={item.title} variant='panel'><AdminSection title={item.title} description={item.description} /><HStack gap={2} flexWrap='wrap'>{item.roles.map((role) => <AdminBadge key={role} tone='accent'>{roleLabels[role]}</AdminBadge>)}</HStack></Surface>)}</SimpleGrid></AdminState></VStack>;
}
