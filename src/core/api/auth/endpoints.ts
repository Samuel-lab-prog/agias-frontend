import { createMutationEndpoint } from '@Api/utils';
import { createHTTPRequest } from '@Utils';

import type { AuthClient, LoginBody } from './types';

const login = createMutationEndpoint<LoginBody, AuthClient>({
	fn: (data) =>
		createHTTPRequest<AuthClient, LoginBody>({
			method: 'POST',
			path: `/auth/login`,
			body: data,
		}),
});

const refresh = createMutationEndpoint<void, AuthClient>({
	fn: () =>
		createHTTPRequest<AuthClient>({
			method: 'POST',
			path: `/auth/refresh`,
		}),
});

export const auth = {
	login,
	refresh,
};
