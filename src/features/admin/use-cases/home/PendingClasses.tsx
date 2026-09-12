import { administration } from '@Api/admin/endpoints';
import { Surface } from '@BaseComponents';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { AdminHeader, AdminLink, AdminState } from '../../components/AdminUI';
import { useAdminQuery } from '../../hooks';

export function PendingClasses() {
	const query = useAdminQuery(['unassigned-classes'], administration.unassignedClasses);
	return <VStack align='stretch' gap={5}><AdminHeader title='Turmas sem professor' description='Vincule um docente para disponibilizar a turma no espaço do professor.' action={<AdminLink to='/admin'>Visão geral</AdminLink>} /><AdminState query={query} empty={query.data?.length === 0}><VStack align='stretch' gap={3}>{query.data?.map((item) => <Surface key={item.id} variant='panel'><HStack justify='space-between' flexWrap='wrap' gap={3}><Box><Text fontSize='xs' color='fg.muted'>{item.code} · {item.academicPeriod.code}</Text><Text fontWeight='semibold' mt={1}>{item.title}</Text></Box><AdminLink to={`/staff/classes/${item.id}`}>Gerenciar vínculo</AdminLink></HStack></Surface>)}</VStack></AdminState></VStack>;
}
