import { catalogLabels, type CatalogType } from '@Api/projects/catalogs';
import type { ProjectDetail, ProjectStatus } from '@Api/projects/endpoints';
import { Surface } from '@BaseComponents';
import { Badge, Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { ServiceLink } from '../../components/UI';
import { dateLabel, finalReportLabels, kindLabels, originLabels, statusLabels } from '../../utils';

const statusColors: Record<ProjectStatus, string> = {
	draft: 'gray',
	submitted: 'yellow',
	active: 'blue',
	completed: 'green',
	cancelled: 'red',
};

function Detail({ label, children }: { label: string; children: ReactNode }) {
	return (
		<Box minW={0}>
			<Text as='dt' fontSize='xs' color='fg.muted' fontWeight='medium' mb={1.5}>
				{label}
			</Text>
			<Box as='dd' m={0} fontSize='sm' fontWeight='medium' lineHeight='1.7' overflowWrap='anywhere'>
				{children}
			</Box>
		</Box>
	);
}

function CatalogDetails({ project, fields }: { project: ProjectDetail; fields: CatalogType[] }) {
	return (
		<SimpleGrid as='dl' columns={{ base: 1, md: fields.length > 2 ? 2 : 1 }} gap={5} m={0}>
			{fields.map((field) => (
				<Detail key={field} label={catalogLabels[field]}>
					{project[field]?.name ?? (
						<Text as='span' color='fg.muted' fontWeight='normal'>
							Não informado
						</Text>
					)}
					{project[field]?.active === false && (
						<Badge variant='outline' colorPalette='gray' ms={2}>
							Inativa
						</Badge>
					)}
				</Detail>
			))}
		</SimpleGrid>
	);
}

export function ProjectOverview({
	project,
	editAction,
}: {
	project: ProjectDetail;
	editAction?: ReactNode;
}) {
	return (
		<VStack align='stretch' gap={5}>
			<VStack align='stretch' gap={3}>
				<HStack justify='space-between' flexWrap='wrap' gap={3}>
					<HStack gap={2} flexWrap='wrap'>
						<Badge colorPalette={statusColors[project.status]} variant='subtle' px={3} py={1}>
							{statusLabels[project.status]}
						</Badge>
						<Badge variant='outline' colorPalette='gray' px={3} py={1}>
							{kindLabels[project.kind]}
						</Badge>
					</HStack>
					<ServiceLink to='/projects'>Voltar à lista</ServiceLink>
				</HStack>
				<Heading
					as='h1'
					fontSize={{ base: '2xl', md: '3xl' }}
					lineHeight='1.3'
					overflowWrap='anywhere'
				>
					{project.title}
				</Heading>
				<HStack color='fg.muted' fontSize='sm' gap={3} flexWrap='wrap'>
					<Text fontFamily='mono' overflowWrap='anywhere'>
						{project.code}
					</Text>
					<Text>
						{originLabels[project.origin]} · Ano {project.year}
					</Text>
				</HStack>
			</VStack>
			<Surface variant='panel'>
				<SimpleGrid as='dl' columns={{ base: 1, sm: 2, xl: 4 }} gap={6} m={0}>
					<Detail label='Coordenação'>{project.coordinator.name}</Detail>
					<Detail label='Unidade'>{project.department?.name ?? 'Não informada'}</Detail>
					<Detail label='Vigência'>
						{dateLabel(project.startsAt)} a {dateLabel(project.endsAt)}
					</Detail>
					<Detail label='Relatório final'>
						<Badge
							colorPalette={
								project.finalReportStatus === 'approved'
									? 'green'
									: project.finalReportStatus === 'submitted'
										? 'yellow'
										: 'gray'
							}
							variant='subtle'
						>
							{finalReportLabels[project.finalReportStatus]}
						</Badge>
					</Detail>
				</SimpleGrid>
			</Surface>
			<Surface variant='panel'>
				<Heading as='h2' fontSize='lg' mb={3}>
					Objetivos do projeto
				</Heading>
				<Text whiteSpace='pre-wrap' lineHeight='1.8' overflowWrap='anywhere' maxW='90ch'>
					{project.objectives}
				</Text>
			</Surface>
			<Surface variant='panel'>
				<HStack justify='space-between' flexWrap='wrap' gap={3} mb={5}>
					<Heading as='h2' fontSize='lg'>
						Classificação e financiamento
					</Heading>
					{editAction}
				</HStack>
				<SimpleGrid
					gridTemplateColumns={{ base: 'minmax(0, 1fr)', xl: 'minmax(0, 2fr) minmax(0, 1fr)' }}
					gap={{ base: 6, xl: 8 }}
				>
					<Box minW={0}>
						<Text
							fontSize='xs'
							fontWeight='semibold'
							color='fg.muted'
							textTransform='uppercase'
							letterSpacing='wide'
							mb={4}
						>
							Enquadramento da pesquisa
						</Text>
						<CatalogDetails
							project={project}
							fields={['knowledgeArea', 'researchGroup', 'researchLine', 'nature', 'researchType']}
						/>
					</Box>
					<Box
						minW={0}
						borderColor='border.default'
						borderLeftWidth={{ base: 0, xl: '1px' }}
						borderTopWidth={{ base: '1px', xl: 0 }}
						ps={{ base: 0, xl: 8 }}
						pt={{ base: 6, xl: 0 }}
					>
						<Text
							fontSize='xs'
							fontWeight='semibold'
							color='fg.muted'
							textTransform='uppercase'
							letterSpacing='wide'
							mb={4}
						>
							Financiamento
						</Text>
						<CatalogDetails project={project} fields={['fundingAgency', 'callName']} />
					</Box>
				</SimpleGrid>
			</Surface>
		</VStack>
	);
}
