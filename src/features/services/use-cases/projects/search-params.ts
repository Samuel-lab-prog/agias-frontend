import { catalogFields, type ClassificationIds } from '@Api/projects/catalogs';
export const searchKeys = [
	'q',
	'code',
	'year',
	'researcher',
	'departmentId',
	'kind',
	'origin',
	'status',
	'finalReport',
	'scope',
	...catalogFields.map((field) => `${field}Id`),
];
export function classificationFromParams(params: URLSearchParams): ClassificationIds {
	return Object.fromEntries(
		catalogFields.map((field) => [
			`${field}Id`,
			params.get(`${field}Id`) ? Number(params.get(`${field}Id`)) : null,
		]),
	);
}
