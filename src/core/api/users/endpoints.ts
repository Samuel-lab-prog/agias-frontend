import type {
	AvatarUploadUrlRequest,
	AvatarUploadUrlResponse,
	CreateUserBody,
	UpdateUserBody,
	UserProfile,
	UsersPage,
	UsersSearchParams,
} from '@Api/users/types';
import { createMutationEndpoint, createQueryEndpoint } from '@Api/utils';
import { createHTTPRequest } from '@Utils';

import { userKeys } from './keys';

const checkNickname = createQueryEndpoint<[string], boolean>({
	key: userKeys.checkNickname,

	fn: (nickname) =>
		createHTTPRequest<UsersPage>({
			method: 'GET',
			path: `/users`,
			query: { limit: 1, searchTerm: nickname },
		}).then((result) => result.users.length > 0),
});

const checkEmail = createQueryEndpoint<[string], boolean>({
	key: userKeys.checkEmail,

	fn: async () => false,
});

const getUsers = createQueryEndpoint<[UsersSearchParams], UsersPage>({
	key: userKeys.search,

	fn: (params) =>
		createHTTPRequest<UsersPage>({
			method: 'GET',
			path: `/users`,
			query: params,
		}),
});

const getUsersPreview = createQueryEndpoint<[Pick<UsersSearchParams, 'limit' | 'searchTerm'>?], UsersPage>({
	key: userKeys.anySearch,

	fn: (params) =>
		createHTTPRequest<UsersPage>({
			method: 'GET',
			path: `/users`,
			query: {
				limit: params?.limit ?? 10,
				searchTerm: params?.searchTerm,
			},
		}),
});

const getPublicUsers = getUsersPreview;

const getProfile = createQueryEndpoint<[string], UserProfile>({
	key: userKeys.profile,

	fn: (id) =>
		createHTTPRequest<UserProfile>({
			method: 'GET',
			path: `/users/${id}`,
		}),
});

const createUser = createMutationEndpoint<CreateUserBody, UserProfile>({
	fn: (data) =>
		createHTTPRequest<UserProfile, CreateUserBody>({
			method: 'POST',
			path: `/users/`,
			body: data,
		}),

	invalidate: [userKeys.all],
});

const updateUser = createMutationEndpoint<UpdateUserBody, UserProfile>({
	fn: (data) =>
		createHTTPRequest<UserProfile, Omit<UpdateUserBody, 'id'>>({
			method: 'PUT',
			path: `/users/me`,
			body: {
				name: data.name,
				nickname: data.nickname,
				email: data.email,
				rg: data.rg,
				cpf: data.cpf,
				role: data.role,
				status: data.status,
				bio: data.bio,
				avatarUrl: data.avatarUrl,
			},
		}),

	invalidate: [userKeys.all],
});

const requestAvatarUploadUrl = createMutationEndpoint<
	AvatarUploadUrlRequest,
	AvatarUploadUrlResponse
>({
	fn: (data) =>
		createHTTPRequest<AvatarUploadUrlResponse, AvatarUploadUrlRequest>({
			method: 'POST',
			path: `/users/me/avatar/upload-url`,
			body: data,
		}),
});

const setAvatar = createMutationEndpoint<{ avatarUrl: string }, UserProfile>({
	fn: (data) =>
		createHTTPRequest<UserProfile, { avatarUrl: string }>({
			method: 'PUT',
			path: `/users/me/avatar`,
			body: data,
		}),
});

const changePassword = createMutationEndpoint<
	{ currentPassword: string; newPassword: string },
	UserProfile
>({
	fn: (data) =>
		createHTTPRequest<UserProfile, { currentPassword: string; newPassword: string }>({
			method: 'PUT',
			path: `/users/me/password`,
			body: data,
		}),
});

const deleteUser = createMutationEndpoint<string, UserProfile>({
	fn: (id) =>
		createHTTPRequest<UserProfile>({
			method: 'DELETE',
			path: `/users/${id}`,
		}),
});

const restoreUser = createMutationEndpoint<string, UserProfile>({
	fn: (id) =>
		createHTTPRequest<UserProfile>({
			method: 'POST',
			path: `/users/${id}/restore`,
		}),
});

export const users = {
	checkNickname,
	checkEmail,
	getUsers,
	getUsersPreview,
	getPublicUsers,
	getProfile,
	createUser,
	updateUser,
	requestAvatarUploadUrl,
	setAvatar,
	changePassword,
	deleteUser,
	restoreUser,
};
