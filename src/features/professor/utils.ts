export function formatDate(value: string | null, options?: Intl.DateTimeFormatOptions) {
	if (!value || !Number.isFinite(Date.parse(value))) return 'Sem data definida';
	return new Intl.DateTimeFormat(
		'pt-BR',
		options ?? { dateStyle: 'medium', timeStyle: 'short' },
	).format(new Date(value));
}

export function initials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join('')
		.toUpperCase();
}

export function errorMessage(error: unknown) {
	return error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
		? error.message
		: 'Não foi possível concluir a solicitação. Tente novamente.';
}

export function monthRange(month: Date) {
	return {
		from: new Date(month.getFullYear(), month.getMonth(), 1).toISOString(),
		to: new Date(month.getFullYear(), month.getMonth() + 1, 1).toISOString(),
	};
}

export function localDay(value: string) {
	const date = new Date(value);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function safeMaterialUrl(value: string) {
	try {
		const url = new URL(value);
		return ['https:', 'http:'].includes(url.protocol) ? url : null;
	} catch {
		return null;
	}
}
