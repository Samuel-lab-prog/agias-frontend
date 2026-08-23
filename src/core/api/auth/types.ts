import type { UserRole, UserStatus } from '@Api/users/types';

export type AuthClient = {
	id: number;
	role: UserRole;
	status: UserStatus;
};

export type LoginBody = {
	cpf: string;
	password: string;
};

export type RefreshBody = Record<string, never>;
