import type { QueryClient } from '@tanstack/react-query';

import { eventBus } from './eventBus';
import { onUserLoggedIn } from './reacters/userLoggedIn';
import { onUserLoggedOut } from './reacters/userLoggedOut';

const GLOBAL_KEY = '__hellopoetry_event_listeners__';

export function registerEventListeners(queryClient: QueryClient): void {
	if ((globalThis as Record<string, unknown>)[GLOBAL_KEY]) return;

	const unsubscribeLogin = eventBus.subscribe(
		'userLoggedIn',
		onUserLoggedIn.bind(null, queryClient),
	);

	const unsubscribeLogout = eventBus.subscribe(
		'userLoggedOut',
		onUserLoggedOut.bind(null, queryClient),
	);

	(globalThis as Record<string, unknown>)[GLOBAL_KEY] = () => {
		unsubscribeLogin();
		unsubscribeLogout();
	};
}
