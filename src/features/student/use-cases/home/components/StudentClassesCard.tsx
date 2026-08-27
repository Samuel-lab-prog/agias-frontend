import type { StudentEnrollment } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useColorModeValue } from '@core/components/ui/color-mode';
import { BookOpen } from 'lucide-react';

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
					display={{ base: 'none', md: 'grid' }}
					columns={{ md: 3 }}
					gap={{ md: 4 }}
					mb={{ md: 3 }}
					px={{ md: 1 }}
					fontSize='sm'
					color='textMuted'
					textAlign='center'
				>
					<Box>Componente Curricular</Box>
					<Box display={{ base: 'none', md: 'block' }}>Local</Box>
					<Box display={{ base: 'none', md: 'block' }}>Horário</Box>
				</SimpleGrid>

				<VStack gap={2} align='stretch'>
					{rows.map((item, index) => (
						<SimpleGrid
							key={item.key}
							columns={{ base: 1, md: 3 }}
							gap={{ base: 1.5, md: 4 }}
							alignItems='center'
							px={{ base: 2.5, md: 3 }}
							py={{ base: 2.25, md: 2.5 }}
							borderRadius='lg'
							bg={index % 2 === 0 ? rowStripeBg : 'transparent'}
							color='text'
							textAlign={{ base: 'left', md: 'center' }}
							cursor='pointer'
							transition='background-color 0.18s ease, transform 0.18s ease'
							_hover={{
								bg: rowHoverBg,
								transform: 'translateX(2px)',
							}}
						>
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
										color='textMuted'
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
										bg={badgeBg}
										color={badgeColor}
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
						</SimpleGrid>
					))}
				</VStack>
			</Box>
		</Surface>
	);
}
