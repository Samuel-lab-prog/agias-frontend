import type { AdminRole, AdminStatus } from '@Api/admin/types';
export const roleLabels: Record<AdminRole, string> = { admin: 'Administrador', staff: 'Secretaria', professor: 'Professor', student: 'Aluno' };
export const statusLabels: Record<AdminStatus, string> = { active: 'Ativo', pending: 'Primeiro acesso pendente', suspended: 'Suspenso', blocked: 'Bloqueado' };
export function adminError(error: unknown) {
	return error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' ? error.message : 'Não foi possível concluir. Tente novamente.';
}
export function nameInitials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase(); }
