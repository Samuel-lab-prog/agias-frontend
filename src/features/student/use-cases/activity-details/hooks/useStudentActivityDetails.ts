import { useParams } from 'react-router-dom';

import { useMyStudentDashboard } from '../../hooks/useMyStudentDashboard';
import { mapStudentActivityDetails } from '../mappers/mapStudentActivityDetails';

export function useStudentActivityDetails() {
	const { enrollmentId: enrollmentParam, activityId: activityParam } = useParams();
	const enrollmentId = Number(enrollmentParam);
	const activityId = Number(activityParam);
	const query = useMyStudentDashboard();
	const enrollment = query.dashboard?.enrollments.find((item) => item.id === enrollmentId);
	const details = enrollment
		? mapStudentActivityDetails(enrollment, activityId, query.dashboard?.submissions ?? [])
		: null;

	return {
		...query,
		details,
		isInvalidId: !Number.isInteger(enrollmentId) || !Number.isInteger(activityId),
		isNotFound: Boolean(query.dashboard && (!enrollment || !details)),
	};
}
