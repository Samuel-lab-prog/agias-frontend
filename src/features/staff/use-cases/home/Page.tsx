import { curriculum } from '@Api/curriculum/endpoints';
import { curriculumKeys } from '@Api/curriculum/keys';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';

import { staffNavigationPreset } from './navigation';

export function StaffHomePage() {
	const periods = useQuery({
		queryKey: curriculumKeys.academicPeriods(),
		queryFn: () => curriculum.getAcademicPeriods.query().queryFn(),
	});
	return (
		<NavigationPageShell preset={staffNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<Box>
					<Heading as='h1' fontSize='2xl'>
						Central do staff
					</Heading>
					<Text color='fg.muted' mt={1}>
						Acesse rapidamente as principais rotinas administrativas.
					</Text>
				</Box>
				<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
					<Surface variant='panel'>
						<Text color='fg.muted' fontSize='sm'>
							Períodos acadêmicos
						</Text>
						<Text fontSize='3xl' fontWeight='bold'>
							{periods.data?.length ?? '—'}
						</Text>
					</Surface>
					<Surface variant='panel'>
						<Text color='fg.muted' fontSize='sm'>
							Calendário
						</Text>
						<Text fontWeight='semibold' mt={2}>
							Eventos institucionais
						</Text>
						<BaseButton asChild size='sm' mt={3}>
							<NavLink to='/staff/academic-calendar'>Gerenciar</NavLink>
						</BaseButton>
					</Surface>
					<Surface variant='panel'>
						<Text color='fg.muted' fontSize='sm'>
							Perfil
						</Text>
						<Text fontWeight='semibold' mt={2}>
							Dados da equipe
						</Text>
						<BaseButton asChild size='sm' variant='secondary' mt={3}>
							<NavLink to='/staff/my-profile'>Ver perfil</NavLink>
						</BaseButton>
					</Surface>
				</SimpleGrid>
			</VStack>
		</NavigationPageShell>
	);
}
