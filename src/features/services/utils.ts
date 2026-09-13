export function errorText(error: unknown) {
	return error && typeof error === 'object' && 'message' in error
		? String(error.message)
		: 'Não foi possível concluir a operação.';
}
export const dateLabel = (date: string) =>
	new Date(date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
export const dateInputValue = (date: string) =>
	new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/Sao_Paulo',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date(date));
export const kindLabels = { teaching: 'Ensino', research: 'Pesquisa', extension: 'Extensão' };
export const statusLabels = {
	draft: 'Rascunho',
	submitted: 'Em avaliação',
	active: 'Em execução',
	completed: 'Concluído',
	cancelled: 'Cancelado',
};
export const originLabels = { internal: 'Interno', external: 'Externo' };
export const finalReportLabels = {
	not_submitted: 'Não submetido',
	submitted: 'Submetido',
	approved: 'Aprovado',
};
