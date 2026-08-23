export type UsersSearchParams = {
	limit?: number;
	cursor?: string;
	orderBy?: 'nickname' | 'createdAt' | 'id';
	orderDirection?: 'asc' | 'desc';
	searchTerm?: string;
	role?: string;
	status?: string;
	deleted?: boolean;
};

export type UserPreview = {
	id: number;
	name: string;
	nickname: string;
	avatarUrl: string | null;
	role: string;
};

export type UsersPage = {
	users: UserPreview[];
	nextCursor?: number;
	hasMore: boolean;
};

export type UserPublicProfile = {
	id: number;
	nickname: string;
	name: string;
	rg?: string;
	cpf?: string;
	email?: string;
	bio?: string | null;
	avatarUrl: string | null;
	role: string;
	status: string;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string | null;
	emailVerifiedAt?: string | null;
};

export type UserPrivateProfile = {
	id: number;
	nickname: string;
	name: string;
	rg?: string;
	cpf?: string;
	bio?: string;
	avatarUrl: string | null;
	role: string;
	status: string;
	email: string;
	emailVerifiedAt: string | null;
	unreadNotificationsCount: number;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string | null;
};

export type UserProfile = UserPublicProfile | UserPrivateProfile;

export type CreateUserBody = {
	name: string;
	nickname: string;
	email: string;
	password: string;
	rg: string;
	cpf: string;
	avatarUrl: string | null;
};

export type CreateStudentRegistrationBody = CreateUserBody & {
	academicId: string;
};

export type UpdateUserBody = {
	id: string;
	name?: string;
	nickname?: string;
	email?: string;
	rg?: string;
	cpf?: string;
	role?: string;
	status?: string;
	bio?: string;
	avatarUrl?: string | null;
};

export type AvatarUploadUrlRequest = {
	contentType: string;
	contentLength?: number;
};

export type AvatarUploadUrlResponse = {
	uploadUrl: string;
	fields: Record<string, string>;
	fileUrl: string;
};

export type UserRole = 'student' | 'professor' | 'staff' | 'admin' | string;
export type UserStatus = 'active' | 'blocked' | 'suspended' | 'banned' | string;
