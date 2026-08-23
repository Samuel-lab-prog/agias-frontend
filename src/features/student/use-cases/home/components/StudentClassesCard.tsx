import type { StudentEnrollment } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Box, Button, Flex, Grid, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { BookOpen } from 'lucide-react';

type StudentClassesCardProps = {
	enrollments: StudentEnrollment[];
};

export function StudentClassesCard({ enrollments }: StudentClassesCardProps) {
	const rows = enrollments.map((enrollment) => {
		const firstSession = enrollment.sessions[0];
		const sessionTime = firstSession
			? new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
					new Date(firstSession.startsAt),
			  )
			: 'Sem aula';

		return {
			key: enrollment.id,
			title: enrollment.classOffering.title,
			location: enrollment.classOffering.code,
			time: sessionTime,
		};
	});

	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }}>
			<Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4}>
				<HStack gap={2}>
					<BookOpen size={18} />
					<Heading as='h3' textStyle='h6'>
						Matérias de hoje
					</Heading>
				</HStack>

				<Button size='sm' variant='ghost' color='pink.100'>
					Ver grade do semestre
				</Button>
			</Flex>

			<Box borderColor='border' overflow='hidden'>
				<Grid
					templateColumns={{ base: 'minmax(0, 1fr)', md: 'minmax(0, 2fr) minmax(120px, 1fr) minmax(110px, 0.9fr)' }}
					bg='rgba(255,255,255,0.03)'
					fontSize='sm'
					fontWeight='semibold'
					px={3}
					py={2}
				>
					<Box textAlign='center'>Componente Curricular</Box>
					<Box display={{ base: 'none', md: 'block' }} textAlign='center'>
						Local
					</Box>
					<Box display={{ base: 'none', md: 'block' }} textAlign='center'>
						Horário
					</Box>
				</Grid>

				{rows.length === 0 ? (
					<VStack px={3} py={6} align='stretch'>
						<Text textStyle='smaller' color='pink.100'>
							Nenhuma turma ativa encontrada.
						</Text>
					</VStack>
				) : (
					rows.map((item) => (
						<Grid
							key={item.key}
							templateColumns={{
								base: 'minmax(0, 1fr)',
								md: 'minmax(0, 2fr) minmax(160px, 1fr) minmax(110px, 0.9fr)',
							}}
							px={3}
							py={2.5}
							alignItems='center'
							cursor='pointer'
							transition='all 0.2s ease'
							_hover={{ bg: 'rgba(255,255,255,0.03)', transform: 'translateX(2px)' }}
						>
							<Box textAlign='left'>
								<Text fontWeight='bold' color='pink.50' textTransform='uppercase' fontSize='xs'>
									{item.title}
								</Text>
							</Box>
							<Box display={{ base: 'none', md: 'block' }} color='pink.100' fontSize='xs' textAlign='center'>
								{item.location}
							</Box>
							<Box display={{ base: 'none', md: 'block' }} color='pink.100' fontSize='xs' textAlign='center'>
								{item.time}
							</Box>
						</Grid>
					))
				)}
			</Box>
		</Surface>
	);
}
