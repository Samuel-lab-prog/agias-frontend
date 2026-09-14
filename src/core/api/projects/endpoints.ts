import { createHTTPRequest } from '@Utils';

import type { CatalogEntry, CatalogType, ClassificationIds } from './catalogs';
import type { ProjectKind } from './types';
export type { ProjectKind } from './types';
export type ProjectStatus = 'draft' | 'submitted' | 'active' | 'completed' | 'cancelled';
export type ProjectOrigin = 'internal' | 'external';
export type FinalReportStatus = 'not_submitted' | 'submitted' | 'approved';
export type ProjectBody = ClassificationIds & {
	title: string;
	objectives: string;
	kind: ProjectKind;
	origin?: ProjectOrigin;
	departmentId?: number;
	startsAt: string;
	endsAt: string;
};
export type Participant = {
	id: number;
	userId: number;
	role: string;
	workPlan: string;
	startsAt: string;
	endsAt: string;
	approvedHours: number | null;
	user: { id: number; name: string };
};
export type Project = Omit<ProjectBody, 'origin'> & { [K in CatalogType]: CatalogEntry | null } & {
	id: number;
	code: string;
	year: number;
	origin: ProjectOrigin;
	coordinatorId: number;
	version: number;
	status: ProjectStatus;
	finalReportStatus: FinalReportStatus;
	department: { id: number; name: string; code: string } | null;
	coordinator: { id: number; name: string };
	_count: { participants: number; reports: number };
};
export type ProjectDetail = Project & {
	participants: Participant[];
	reports: {
		id: number;
		authorId: number;
		title: string;
		body: string;
		approved: boolean;
		createdAt: string;
	}[];
	events: { id: number; action: string; note: string; createdAt: string }[];
};
const base = '/projects';
export const projects = {
	list: (
		query: ClassificationIds & {
			page?: number;
			q?: string;
			code?: string;
			year?: number;
			researcher?: string;
			departmentId?: number;
			kind?: string;
			origin?: string;
			status?: string;
			finalReport?: string;
			scope?: string;
			ownership?: string;
		},
	) =>
		createHTTPRequest<{ items: Project[]; total: number; page: number; pageSize: number }>({
			path: base + '/',
			query: Object.fromEntries(
				Object.entries(query).map(([key, value]) => [key, value ?? undefined]),
			),
		}),
	departments: (scope?: string) =>
		createHTTPRequest<{ id: number; name: string; code: string }[]>({
			path: base + '/departments',
			query: scope ? { scope } : undefined,
		}),
	reportUrl: (query: Record<string, string>) => {
		const search = new URLSearchParams(query);
		search.delete('view');
		search.delete('searched');
		search.delete('page');
		return base + '/report?' + search.toString();
	},
	updateClassification: (
		id: number,
		body: ClassificationIds & { departmentId: number | null; version: number },
	) =>
		createHTTPRequest<{ id: number }, typeof body>({
			path: `${base}/${id}/classification`,
			method: 'PUT',
			body,
		}),
	detail: (id: number) => createHTTPRequest<ProjectDetail>({ path: base + '/' + id }),
	create: (body: ProjectBody) =>
		createHTTPRequest<Project, ProjectBody>({ path: base + '/', method: 'POST', body }),
	candidates: (q: string) =>
		createHTTPRequest<{ id: number; name: string; role: string }[]>({
			path: base + '/candidates',
			query: { q },
		}),
	researchers: (q: string, scope: string) =>
		createHTTPRequest<{ id: number; name: string }[]>({
			path: base + '/researchers',
			query: { q, scope },
		}),
	participant: (
		id: number,
		body: { userId: number; role: string; workPlan: string; startsAt: string; endsAt: string },
	) =>
		createHTTPRequest<unknown, typeof body>({
			path: `${base}/${id}/participants`,
			method: 'POST',
			body,
		}),
	report: (id: number, body: { title: string; body: string }) =>
		createHTTPRequest<unknown, typeof body>({
			path: `${base}/${id}/reports`,
			method: 'POST',
			body,
		}),
	approveReport: (id: number, reportId: number) =>
		createHTTPRequest<unknown>({
			path: `${base}/${id}/reports/${reportId}/approve`,
			method: 'POST',
		}),
	hours: (id: number, participantId: number, hours: number) =>
		createHTTPRequest<unknown, { hours: number }>({
			path: `${base}/${id}/participants/${participantId}/hours`,
			method: 'PUT',
			body: { hours },
		}),
	transition: (id: number, body: { status: ProjectStatus; version: number; note: string }) =>
		createHTTPRequest<unknown, typeof body>({ path: `${base}/${id}/status`, method: 'POST', body }),
};
