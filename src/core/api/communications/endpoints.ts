import { createMutationEndpoint, createQueryEndpoint } from '@Api/utils';
import { createHTTPRequest } from '@Utils';

import { communicationsKeys } from './keys';
import type { AnnouncementListItem, CreateAnnouncementBody } from './types';

const getMyAnnouncements = createQueryEndpoint<[], AnnouncementListItem[]>({
	key: communicationsKeys.myAnnouncements,
	fn: () =>
		createHTTPRequest<AnnouncementListItem[]>({
			method: 'GET',
			path: '/communications/announcements/me',
		}),
});

const createAnnouncement = createMutationEndpoint<CreateAnnouncementBody, AnnouncementListItem>({
	fn: (data) =>
		createHTTPRequest<AnnouncementListItem, CreateAnnouncementBody>({
			method: 'POST',
			path: '/communications/announcements',
			body: data,
		}),
});

export const communications = {
	getMyAnnouncements,
	createAnnouncement,
};
