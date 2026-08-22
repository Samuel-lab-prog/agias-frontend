import { users } from '@Api/users/endpoints';
import { userKeys } from '@Api/users/keys';
import type { UserPrivateProfile } from '@Api/users/types';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import type { AppEvents } from '@root/core/events/eventBus';
import type { QueryClient } from '@tanstack/react-query';

export async function onUserLoggedIn(
	queryClient: QueryClient,
	payload: AppEvents['userLoggedIn'],
): Promise<void> {
	const authStore = useAuthClientStore.getState();

	const profileKey = userKeys.profile(String(payload.userId));
	try {
		const myProfile = (await users.getProfile.fetch(String(payload.userId))) as UserPrivateProfile;
		authStore.setUnreadNotificationsCount(myProfile.unreadNotificationsCount);
		queryClient.setQueryData(profileKey, myProfile);
	} catch {
		authStore.setUnreadNotificationsCount(0);
	}
}
