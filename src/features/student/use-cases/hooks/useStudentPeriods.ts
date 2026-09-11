import type { StudentEnrollment } from '@Api/academic/types';
import { curriculum } from '@Api/curriculum/endpoints';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { periodLabel } from '../../utils/academic-planning';

export function useStudentPeriods(enrollments: StudentEnrollment[]) {
	const [params, setParams] = useSearchParams();
	const query = useQuery({ ...curriculum.getAcademicPeriods.query(), staleTime: 300_000 });
	const periods = [
		...new Set([
			...(query.data ?? []).map((period) => period.code),
			...enrollments.map(periodLabel),
		]),
	]
		.sort()
		.reverse();
	const selectedPeriod = params.get('period') ?? 'all';
	const setSelectedPeriod = (period: string) =>
		setParams((current) => {
			const next = new URLSearchParams(current);
			if (period === 'all') next.delete('period');
			else next.set('period', period);
			next.delete('class');
			return next;
		});
	return {
		periods,
		selectedPeriod,
		setSelectedPeriod,
		academicPeriods: query.data ?? [],
		isPeriodsError: query.isError,
		refetchPeriods: query.refetch,
	};
}
