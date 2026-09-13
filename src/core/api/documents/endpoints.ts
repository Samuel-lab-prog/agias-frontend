import { createHTTPRequest } from '@Utils';
export type DocumentKind = 'enrollment' | 'affiliation' | 'participation';
export type IssuedDocument = {
	id: string;
	kind: DocumentKind;
	createdAt: string;
	verificationCode: string;
	revokedAt: string | null;
	revocationReason: string | null;
	snapshot: {
		subjectName: string;
		title: string;
		institution: string;
		campus: string;
		paragraphs: string[];
	};
};
export type VerifiedDocument = {
	id: string;
	title: string;
	subjectName: string;
	institution: string;
	campus: string;
	issuedAt: string;
	revokedAt: string | null;
	templateVersion: number;
};
export const documents = {
	list: () => createHTTPRequest<IssuedDocument[]>({ path: '/documents/' }),
	participations: () =>
		createHTTPRequest<{ id: number; approvedHours: number; project: { title: string } }[]>({
			path: '/documents/participations',
		}),
	issue: (body: { kind: DocumentKind; subjectUserId?: number; participantId?: number }) =>
		createHTTPRequest<IssuedDocument, typeof body>({ path: '/documents/', method: 'POST', body }),
	verify: (code: string) =>
		createHTTPRequest<VerifiedDocument>({ path: '/documents/verify/' + encodeURIComponent(code) }),
	revoke: (id: string, reason: string) =>
		createHTTPRequest<unknown, { reason: string }>({
			path: '/documents/' + id + '/revoke',
			method: 'POST',
			body: { reason },
		}),
	pdfUrl: (id: string) =>
		import.meta.env.VITE_API_URL.replace(/\/$/, '') +
		'/documents/' +
		encodeURIComponent(id) +
		'/pdf',
};
