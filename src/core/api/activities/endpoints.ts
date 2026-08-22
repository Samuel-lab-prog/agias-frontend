import { createMutationEndpoint, createQueryEndpoint } from '@Api/utils';
import { createHTTPRequest } from '@Utils';

import { activitiesKeys } from './keys';
import type {
	AcademicActivity,
	AcademicActivitySubmission,
	CreateAcademicActivityBody,
	CreateAcademicActivitySubmissionBody,
} from './types';

const getByClassOffering = createQueryEndpoint<[string], AcademicActivity[]>({
	key: activitiesKeys.byClassOffering,
	fn: (classOfferingId) =>
		createHTTPRequest<AcademicActivity[]>({
			method: 'GET',
			path: `/activities/class-offerings/${classOfferingId}`,
		}),
});

const getSubmissionsByStudentProfile = createQueryEndpoint<[string], AcademicActivitySubmission[]>({
	key: activitiesKeys.submissionsByStudentProfile,
	fn: (studentProfileId) =>
		createHTTPRequest<AcademicActivitySubmission[]>({
			method: 'GET',
			path: `/activities/students/${studentProfileId}/submissions`,
		}),
});

const createAcademicActivity = createMutationEndpoint<CreateAcademicActivityBody, AcademicActivity>({
	fn: (data) =>
		createHTTPRequest<AcademicActivity, CreateAcademicActivityBody>({
			method: 'POST',
			path: '/activities/',
			body: data,
		}),
});

const createAcademicActivitySubmission = createMutationEndpoint<
	CreateAcademicActivitySubmissionBody,
	AcademicActivitySubmission
>({
	fn: (data) =>
		createHTTPRequest<AcademicActivitySubmission, CreateAcademicActivitySubmissionBody>({
			method: 'POST',
			path: `/activities/${String((data as Record<string, unknown>).activityId ?? '')}/submissions/me`,
			body: data,
		}),
});

export const activities = {
	getByClassOffering,
	getSubmissionsByStudentProfile,
	createAcademicActivity,
	createAcademicActivitySubmission,
};
