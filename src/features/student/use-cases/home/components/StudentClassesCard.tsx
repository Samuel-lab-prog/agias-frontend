import type { StudentEnrollment } from '@Api/academic/types';
import { BaseButton, componentColors, componentRadii, Surface } from '@BaseComponents';
import { Badge, Box, Flex, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useColorModeValue } from '@core/components/ui/color-mode';
import { BookOpen } from 'lucide-react';

type StudentClassesCardProps = {
	enrollments: StudentEnrollment[];
};

export function StudentClassesCard({ enrollments }: StudentClassesCardProps) {
	const rowStripeBg = useColorModeValue(
		componentColors.light.background,
		componentColors.dark.surface,
	);
	const rowHoverBg = useColorModeValue(
		componentColors.light.accentSoft,
		componentColors.dark.accentSoft,
	);
	const badgeBg = useColorModeValue('rgba(37, 99, 235, 0.08)', 'rgba(96, 165, 250, 0.16)');
	const badgeColor = useColorModeValue(componentColors.light.accent, componentColors.dark.accent);

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
		<Surface variant='soft' p={{ base: 4, md: 5 }}>
			<Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4}>
				<HStack gap={2}>
					<BookOpen size={18} />
					<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
						Matérias de hoje
					</Heading>
				</HStack>

				<BaseButton
					size='sm'
					variant='outlinePurple'
					color={componentColors.light.textMuted}
					_dark={{ color: componentColors.dark.textMuted }}
				>
					Ver grade do semestre
				</BaseButton>
			</Flex>

			<Surface variant='soft' p={{ base: 3, md: 5 }}>
				<SimpleGrid
					display={{ base: 'none', md: 'grid' }}
					columns={{ md: 3 }}
					gap={{ md: 4 }}
					mb={{ md: 3 }}
					px={{ md: 1 }}
					fontSize='sm'
					color={componentColors.light.textMuted}
					textAlign='center'
					_dark={{ color: componentColors.dark.textMuted }}
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
							borderRadius={componentRadii.lg}
							bg={index % 2 === 0 ? rowStripeBg : 'transparent'}
							color={componentColors.light.text}
							_dark={{ color: componentColors.dark.text }}
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
										color={componentColors.light.textMuted}
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
										borderRadius={componentRadii.full}
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
									color={componentColors.light.textMuted}
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
									borderRadius={componentRadii.full}
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
			</Surface>
		</Surface>
	);
}
