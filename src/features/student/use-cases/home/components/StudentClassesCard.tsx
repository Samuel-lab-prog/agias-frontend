import type { StudentEnrollment } from '@Api/academic/types';
import { BaseButton, Surface } from '@BaseComponents';
import { Badge, Box, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useColorModeValue } from '@core/components/ui/color-mode';
import { BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { StudentCard, StudentCardHeader } from './StudentCard';

type StudentClassesCardProps = {
	enrollments: StudentEnrollment[];
};

export function StudentClassesCard({ enrollments }: StudentClassesCardProps) {
	const rowStripeBg = useColorModeValue('bg.canvas', 'bg.surface');

	const rows = enrollments.map((enrollment) => {
		const firstSession = enrollment.sessions[0];
		const sessionTime = firstSession
			? new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
					new Date(firstSession.startsAt),
				)
			: 'Sem aula';

		return {
			key: enrollment.id,
			href: `/student/subjects/${enrollment.id}`,
			title: enrollment.classOffering.title,
			location: enrollment.classOffering.code,
			time: sessionTime,
		};
	});

	return (
		<StudentCard>
			<StudentCardHeader
				icon={<BookOpen size={18} />}
				title='Matérias de hoje'
				action={
					<BaseButton size='sm' variant='secondary' color='fg.muted'>
						Ver grade do semestre
					</BaseButton>
				}
			/>

			<Surface variant='soft' p={{ base: 3, md: 5 }}>
				<SimpleGrid
					display={{ base: 'none', md: 'grid' }}
					columns={{ md: 3 }}
					gap={{ md: 4 }}
					mb={{ md: 3 }}
					px={{ md: 1 }}
					fontSize='sm'
					color='fg.muted'
					textAlign='center'
				>
					<Box>Componente Curricular</Box>
					<Box display={{ base: 'none', md: 'block' }}>Local</Box>
					<Box display={{ base: 'none', md: 'block' }}>Horário</Box>
				</SimpleGrid>

				<VStack gap={2} align='stretch'>
					{rows.map((item, index) => (
						<SimpleGrid
							asChild
							key={item.key}
							columns={{ base: 1, md: 3 }}
							gap={{ base: 1.5, md: 4 }}
							alignItems='center'
							px={{ base: 2.5, md: 3 }}
							py={{ base: 2.25, md: 2.5 }}
							borderRadius='lg'
							bg={index % 2 === 0 ? rowStripeBg : 'transparent'}
							color='fg.default'
							textAlign={{ base: 'left', md: 'center' }}
							cursor='pointer'
							transition='background-color 0.18s ease, transform 0.18s ease'
							_hover={{
								bg: 'action.primarySubtle',
								transform: 'translateX(2px)',
							}}
						>
							<NavLink to={item.href} aria-label={`Ver detalhes de ${item.title}`}>
								<Box minW={0} display='flex' flexDirection='column' gap={0.5}>
									<Text
										fontWeight='700'
										textTransform='uppercase'
										fontSize={{ base: '11px', md: 'xs' }}
										letterSpacing='0.03em'
										lineHeight='1.2'
									>
										{item.title}
									</Text>
									<Box
										display={{ base: 'flex', md: 'none' }}
										alignItems='center'
										justifyContent='space-between'
										gap={2}
									>
										<Text
											fontSize='xs'
											color='fg.muted'
											lineHeight='1.2'
											whiteSpace='nowrap'
											overflow='hidden'
											textOverflow='ellipsis'
										>
											{item.location}
										</Text>
										<Badge
											px={2.5}
											py={1}
											borderRadius='full'
											bg='action.primarySubtle'
											color='action.primary'
											fontSize='xs'
											fontWeight='700'
											flexShrink={0}
										>
											{item.time}
										</Badge>
									</Box>
								</Box>

								<Box display={{ base: 'none', md: 'block' }} minW={0}>
									<Text
										fontSize='sm'
										color='fg.muted'
										whiteSpace='nowrap'
										overflow='hidden'
										textOverflow='ellipsis'
									>
										{item.location}
									</Text>
								</Box>

								<Box display={{ base: 'none', md: 'block' }}>
									<Badge
										px={3}
										py={1.5}
										borderRadius='full'
										bg='action.primarySubtle'
										color='action.primary'
										fontSize='sm'
										fontWeight='700'
										minW='fit-content'
									>
										{item.time}
									</Badge>
								</Box>
							</NavLink>
						</SimpleGrid>
					))}
				</VStack>
			</Surface>
		</StudentCard>
	);
}
