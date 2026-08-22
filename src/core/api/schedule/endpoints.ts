import { createMutationEndpoint, createQueryEndpoint } from '@Api/utils';
import { createHTTPRequest } from '@Utils';

import { scheduleKeys } from './keys';
import type { ClassSession, CreateClassSessionBody, UpdateClassSessionBody } from './types';

const getByClassOffering = createQueryEndpoint<[string], ClassSession[]>({
	key: scheduleKeys.byClassOffering,
	fn: (classOfferingId) =>
		createHTTPRequest<ClassSession[]>({
			method: 'GET',
			path: `/schedule/class-offerings/${classOfferingId}/sessions`,
		}),
});

const createClassSession = createMutationEndpoint<CreateClassSessionBody, ClassSession>({
	fn: (data) =>
		createHTTPRequest<ClassSession, CreateClassSessionBody>({
			method: 'POST',
			path: '/schedule/class-sessions',
			body: data,
		}),
});

const updateClassSession = createMutationEndpoint<UpdateClassSessionBody, ClassSession>({
	fn: (data) =>
		createHTTPRequest<ClassSession, UpdateClassSessionBody>({
			method: 'PUT',
			path: `/schedule/class-sessions/${String((data as Record<string, unknown>).classSessionId ?? '')}`,
			body: data,
		}),
});

const deleteClassSession = createMutationEndpoint<Record<string, unknown>, ClassSession>({
	fn: (data) =>
		createHTTPRequest<ClassSession>({
			method: 'DELETE',
			path: `/schedule/class-sessions/${String((data as Record<string, unknown>).classSessionId ?? '')}`,
		}),
});

export const schedule = {
	getByClassOffering,
	createClassSession,
	updateClassSession,
	deleteClassSession,
};
