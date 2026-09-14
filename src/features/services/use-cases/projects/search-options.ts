export type SearchOption = { id: number; name: string; code?: string | null; active?: boolean };
export const optionLabel = (item: SearchOption) =>
	`${item.code ? `${item.code} — ` : ''}${item.name}${item.active === false ? ' (inativa)' : ''}`;
