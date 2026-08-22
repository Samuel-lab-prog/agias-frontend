import { createQueryKeys } from '@Api/utils';

export const userKeys = createQueryKeys({
	all: () => ['users'] as const,
	search: (params: {
		limit?: number;
		cursor?: string;
		orderBy?: 'nickname' | 'createdAt' | 'id';
		orderDirection?: 'asc' | 'desc';
		searchTerm?: string;
		role?: string;
		status?: string;
		deleted?: boolean;
	}) => ['users', 'search', params] as const,
	profile: (id: string) => ['users', 'profile', id] as const,
	checkNickname: (nickname: string) => ['users', 'check-nickname', nickname] as const,
	checkEmail: (email: string) => ['users', 'check-email', email] as const,
	anyProfile: () => ['users', 'profile'] as const,
	anySearch: () => ['users', 'search'] as const,
});
