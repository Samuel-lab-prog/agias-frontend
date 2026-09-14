import { createHTTPRequest } from '@Utils';

import type { ProjectKind } from './types';

// These are field definitions, not classification options. All options come from the API.
export const catalogLabels = {
	knowledgeArea: 'Área do conhecimento',
	researchGroup: 'Grupo de pesquisa',
	researchLine: 'Linha de pesquisa',
	fundingAgency: 'Agência financiadora',
	callName: 'Edital',
	nature: 'Natureza do projeto',
	researchType: 'Tipo de pesquisa',
} as const;
export type CatalogType = keyof typeof catalogLabels;
export type ClassificationIds = { [K in CatalogType as `${K}Id`]?: number | null };
export type CatalogBody = {
	type: CatalogType;
	name: string;
	code: string | null;
	kind: ProjectKind | null;
	parentId: number | null;
	active: boolean;
};
export type CatalogEntry = CatalogBody & { id: number; version: number };
export const catalogFields = Object.keys(catalogLabels) as CatalogType[];
export const parentFields: Partial<Record<CatalogType, CatalogType>> = {
	callName: 'fundingAgency',
	researchLine: 'researchGroup',
};
export const projectCatalogs = {
	list: () => createHTTPRequest<CatalogEntry[]>({ path: '/projects/catalogs' }),
	create: (body: CatalogBody) =>
		createHTTPRequest<CatalogEntry, CatalogBody>({
			path: '/projects/catalogs',
			method: 'POST',
			body,
		}),
	update: (id: number, body: CatalogBody & { version: number }) =>
		createHTTPRequest<CatalogEntry, typeof body>({
			path: `/projects/catalogs/${id}`,
			method: 'PUT',
			body,
		}),
};
