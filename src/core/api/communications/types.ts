export type Announcement = {
	id: number;
	title: string;
	body: string;
	audience: string;
	isPinned: boolean;
	publishedAt: string | null;
	expiresAt: string | null;
	createdByUserId: number;
	createdAt: string;
	updatedAt: string;
};

export type AnnouncementListItem = Announcement & {
	createdByName: string;
};

export type CreateAnnouncementBody = {
	title: string;
	body: string;
	audience: 'all' | 'student' | 'professor' | 'staff' | 'admin';
	isPinned?: boolean;
	publishedAt?: string | null;
	expiresAt?: string | null;
};
