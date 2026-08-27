import type { StudentEnrollment } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Badge, Box, Button, Flex, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { BookOpen } from 'lucide-react';
import { useColorModeValue } from '@core/components/ui/color-mode';

type StudentClassesCardProps = {
	enrollments: StudentEnrollment[];
};

export function StudentClassesCard({ enrollments }: StudentClassesCardProps) {
	const cardBg = useColorModeValue(
		'linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.98))',
		'linear-gradient(180deg, rgba(10, 18, 38, 0.92), rgba(14, 23, 44, 0.98))',
	);
	const rowStripeBg = useColorModeValue('rgba(15, 23, 42, 0.02)', 'rgba(255, 255, 255, 0.02)');
	const rowHoverBg = useColorModeValue('rgba(37, 99, 235, 0.08)', 'rgba(37, 99, 235, 0.08)');
	const badgeBg = useColorModeValue('rgba(37, 99, 235, 0.10)', 'rgba(37, 99, 235, 0.24)');
	const badgeColor = useColorModeValue('blue.700', 'white');

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

				<Button
					size='sm'
					variant='outline'
					color='textMuted'
					borderColor='border'
					bg='transparent'
					_hover={{ bg: 'surface', borderColor: 'borderHover', color: 'text' }}
				>
					Ver grade do semestre
				</Button>
			</Flex>

			<Box
				bg={cardBg}
				borderRadius='xl'
				px={{ base: 3, md: 5 }}
				py={{ base: 3, md: 4 }}
				boxShadow='inset 0 1px 0 rgba(255,255,255,0.03)'
			>
				<SimpleGrid
					columns={{ base: 1, md: 3 }}
					gap={4}
					mb={3}
					px={{ base: 0, md: 1 }}
					fontSize='sm'
					color='textMuted'
					textAlign='center'
				>
					<Box>Componente Curricular</Box>
					<Box display={{ base: 'none', md: 'block' }}>Local</Box>
					<Box display={{ base: 'none', md: 'block' }}>
						Horário
					</Box>
				</SimpleGrid>

				<VStack gap={2} align='stretch'>
					{rows.map((item, index) => (
						<SimpleGrid
							key={item.key}
							columns={{ base: 1, md: 3 }}
							gap={4}
							alignItems='center'
							px={{ base: 2, md: 3 }}
							py={2.5}
							borderRadius='lg'
							bg={index % 2 === 0 ? rowStripeBg : 'transparent'}
							color='text'
							textAlign='center'
							cursor='pointer'
							transition='background-color 0.18s ease, transform 0.18s ease'
							_hover={{
								bg: rowHoverBg,
								transform: 'translateX(2px)',
							}}
						>
							<Box minW={0}>
								<Text
									fontWeight='700'
									textTransform='uppercase'
									fontSize='xs'
									letterSpacing='0.03em'
									lineHeight='1.2'
								>
									{item.title}
								</Text>
							</Box>

							<Box display={{ base: 'none', md: 'block' }} minW={0}>
								<Text
									fontSize='sm'
									color='textMuted'
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
									bg={badgeBg}
									color={badgeColor}
									fontSize='sm'
									fontWeight='700'
									minW='fit-content'
								>
									{item.time}
								</Badge>
							</Box>

							<Box display={{ base: 'block', md: 'none' }} textAlign='center'>
								<Text fontSize='sm' color='textMuted' mt={1}>
									{item.location}
								</Text>
								<Badge
									mt={2}
									px={3}
									py={1.5}
									borderRadius='full'
									bg={badgeBg}
									color={badgeColor}
									fontSize='sm'
									fontWeight='700'
								>
									{item.time}
								</Badge>
							</Box>
						</SimpleGrid>
					))}
				</VStack>
			</Box>
		</Surface>
	);
}
