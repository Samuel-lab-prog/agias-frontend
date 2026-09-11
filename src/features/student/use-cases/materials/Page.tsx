import { EmptyStateCard, ErrorStateCard, Surface } from '@BaseComponents';
import { Heading, Link, Text, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { NavLink } from 'react-router-dom';

import { AcademicPeriodSelector } from '../../components/AcademicPeriodSelector';
import { MaterialLinks } from '../../components/MaterialLinks';
import { periodLabel } from '../../utils/academic-planning';
import { studentNavigationPreset } from '../../utils/navigation-routes';
import { useMyStudentDashboard } from '../hooks/useMyStudentDashboard';
import { useStudentPeriods } from '../hooks/useStudentPeriods';

export function StudentMaterialsPage() {
	const query = useMyStudentDashboard();
	const enrollments = query.dashboard?.enrollments ?? [];
	const { periods, selectedPeriod, setSelectedPeriod } = useStudentPeriods(enrollments);
	const visible = enrollments.filter(
		(item) => selectedPeriod === 'all' || periodLabel(item) === selectedPeriod,
	);
	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<Heading as='h1' size='xl'>
					Materiais de estudo
				</Heading>
				<AcademicPeriodSelector
					periods={periods}
					value={selectedPeriod}
					onChange={setSelectedPeriod}
				/>
				{query.isLoading ? (
					<Text role='status'>Carregando materiais…</Text>
				) : query.isError ? (
					<ErrorStateCard
						eyebrow='MATERIAIS'
						title='Não foi possível carregar os materiais'
						description='Tente novamente.'
						actionLabel='Tentar novamente'
						onAction={() => void query.refetch()}
					/>
				) : !visible.length ? (
					<EmptyStateCard
						eyebrow='MATERIAIS'
						title='Nenhuma disciplina neste período'
						description='Os materiais publicados aparecerão aqui.'
					/>
				) : (
					visible.map((item) => (
						<Surface key={item.id} variant='panel'>
							<Link asChild color='action.primary' mb={3}>
								<NavLink
									to={`/student/classes/${item.classOffering.id}?period=${encodeURIComponent(selectedPeriod)}`}
								>
									{item.classOffering.title}
								</NavLink>
							</Link>
							<MaterialLinks
								materials={[
									...item.sessions.flatMap((session) =>
										(session.materials ?? []).map((material) => ({
											...material,
											id: material.id * 2,
										})),
									),
									...item.activities.flatMap((activity) =>
										(activity.attachments ?? []).map((file) => ({
											id: file.id * 2 + 1,
											title: file.fileName,
											url: file.fileUrl,
										})),
									),
								]}
							/>
						</Surface>
					))
				)}
			</VStack>
		</NavigationPageShell>
	);
}
