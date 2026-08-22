import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import type { AppEvents } from '@root/core/events/eventBus';
import type { QueryClient } from '@tanstack/react-query';

function clearStoredSessionData(): void {
	useAuthClientStore.getState().setUnreadNotificationsCount(0);
}

export async function onUserLoggedOut(
	queryClient: QueryClient,
	payload: AppEvents['userLoggedOut'],
): Promise<void> {
	void payload;

	clearStoredSessionData();
	await queryClient.clear();
}
