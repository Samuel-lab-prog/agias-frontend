export const formText = (data: FormData, name: string) => String(data.get(name) ?? '').trim();
export const optionalText = (data: FormData, name: string) => formText(data, name) || null;

export function formTitle(data: FormData, name: string) {
	const value = formText(data, name);
	if (value.length < 3) throw new Error('Informe um título com pelo menos 3 caracteres.');
	return value;
}

export function formDate(data: FormData, name: string, required = false) {
	const value = formText(data, name);
	if (!value && !required) return null;
	if (!value || !Number.isFinite(Date.parse(value)))
		throw new Error('Informe uma data e um horário válidos.');
	return new Date(value).toISOString();
}
