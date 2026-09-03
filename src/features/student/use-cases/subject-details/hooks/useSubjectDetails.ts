import { useParams } from 'react-router-dom';

import { useMyStudentDashboard } from '../../hooks/useMyStudentDashboard';
import { mapSubjectDetails } from '../mappers/mapSubjectDetails';

export function useSubjectDetails() {
	const { enrollmentId } = useParams<{ enrollmentId: string }>();
	const dashboardQuery = useMyStudentDashboard();
	const parsedEnrollmentId = Number(enrollmentId);
	const hasValidId = Number.isInteger(parsedEnrollmentId) && parsedEnrollmentId > 0;
	const enrollment = hasValidId
		? dashboardQuery.dashboard?.enrollments.find((item) => item.id === parsedEnrollmentId)
		: undefined;

	return {
		...dashboardQuery,
		details: enrollment
			? mapSubjectDetails(enrollment, dashboardQuery.dashboard?.submissions ?? [])
			: undefined,
		isInvalidId: !hasValidId,
		isNotFound: Boolean(dashboardQuery.dashboard && hasValidId && !enrollment),
	};
}
