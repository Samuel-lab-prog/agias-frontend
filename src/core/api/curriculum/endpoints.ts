import { createMutationEndpoint, createQueryEndpoint } from '@Api/utils';
import { createHTTPRequest } from '@Utils';

import { curriculumKeys } from './keys';
import type {
	AcademicPeriod,
	ClassOffering,
	CreateAcademicPeriodBody,
	CreateClassOfferingBody,
} from './types';

const getCurriculum = createQueryEndpoint<[], never>({
	key: curriculumKeys.all,
	fn: async () => {
		throw new Error('Curriculum read endpoints are not exposed by the backend yet.');
	},
});

const createAcademicPeriod = createMutationEndpoint<CreateAcademicPeriodBody, AcademicPeriod>({
	fn: (data) =>
		createHTTPRequest<AcademicPeriod, CreateAcademicPeriodBody>({
			method: 'POST',
			path: '/curriculum/academic-periods',
			body: data,
		}),
});

const createClassOffering = createMutationEndpoint<CreateClassOfferingBody, ClassOffering>({
	fn: (data) =>
		createHTTPRequest<ClassOffering, CreateClassOfferingBody>({
			method: 'POST',
			path: '/curriculum/class-offerings',
			body: data,
		}),
});

export const curriculum = {
	getCurriculum,
	createAcademicPeriod,
	createClassOffering,
};
