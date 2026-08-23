const statusLabels: Record<string, string> = {
	active: 'Ativo',
	pending: 'Pendente',
	blocked: 'Bloqueado',
	suspended: 'Suspenso',
	banned: 'Banido',
	approved: 'Aprovado',
	rejected: 'Reprovado',
};

const shiftLabels: Record<string, string> = {
	morning: 'Manhã',
	afternoon: 'Tarde',
	evening: 'Noite',
	integral: 'Integral',
};

const audienceLabels: Record<string, string> = {
	all: 'Todos',
	student: 'Estudantes',
	professor: 'Professores',
	staff: 'Staff',
	admin: 'Admin',
};

export function translateBackendStatus(value?: string | null) {
	if (!value) return '...';
	return statusLabels[value] ?? value;
}

export function translateBackendShift(value?: string | null) {
	if (!value) return '...';
	return shiftLabels[value] ?? value;
}

export function translateBackendAudience(value?: string | null) {
	if (!value) return '...';
	return audienceLabels[value] ?? value;
}
