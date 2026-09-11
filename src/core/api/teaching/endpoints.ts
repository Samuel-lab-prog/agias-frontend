import { createHTTPRequest } from '@Utils';

import type { Activity, Lesson, Page, Plan, RosterRow, TeachingClass, TeachingOverview } from './types';
const base = '/teaching';
const query = (params: Record<string, string | number | undefined>) => Object.entries(params).filter(([, value]) => value !== undefined && value !== '').map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`).join('&');
export const teaching = {
	overview: () => createHTTPRequest<TeachingOverview>({ path: `${base}/overview` }),
	classes: (params: { page?: number; q?: string }) => createHTTPRequest<Page<TeachingClass>>({ path: `${base}/classes?${query(params)}` }),
	detail: (id: number) => createHTTPRequest<TeachingClass & { coursePlan: Plan | null }>({ path: `${base}/classes/${id}` }),
	lessons: (params: { page?: number; classId?: number; from?: string; to?: string }) => createHTTPRequest<Page<Lesson>>({ path: `${base}/lessons?${query(params)}` }),
	activities: (params: { page?: number; classId?: number; q?: string }) => createHTTPRequest<Page<Activity>>({ path: `${base}/activities?${query(params)}` }),
	materials: (params: { page?: number; q?: string }) => createHTTPRequest<Page<{ id: number; title: string; url: string; classSessionId: number; classSession: { topic: string | null; classOfferingId: number; classOffering: { title: string } } }>>({ path: `${base}/materials?${query(params)}` }),
	roster: (classId: number, params: { page?: number; q?: string; lessonId?: number; activityId?: number }) => createHTTPRequest<Page<RosterRow>>({ path: `${base}/classes/${classId}/roster?${query(params)}` }),
	savePlan: (classId: number, body: Omit<Plan, 'id' | 'units'>) => createHTTPRequest<{ success: boolean }, typeof body>({ path: `${base}/classes/${classId}/plan`, method: 'PUT', body }),
	addUnit: (classId: number, body: { title: string; topics: string[] }) => createHTTPRequest<{ success: boolean }, typeof body>({ path: `${base}/classes/${classId}/plan/units`, method: 'POST', body }),
	saveLesson: (classId: number, body: { topic: string; startsAt: string; endsAt: string | null; room: string | null; deliveredContent: string | null; publicNotes: string | null; status: string; coursePlanTopicId: number | null }) => createHTTPRequest<{ id: number }, typeof body>({ path: `${base}/classes/${classId}/lessons`, method: 'POST', body }),
	saveActivity: (classId: number, body: { title: string; description: string | null; kind: string; dueAt: string | null; appliesAt: string | null; maxGrade: number | null; weight: number | null; assessmentType: string | null; allowLateSubmissions: boolean }) => createHTTPRequest<{ id: number }, typeof body>({ path: `${base}/classes/${classId}/activities`, method: 'POST', body }),
	grade: (activityId: number, body: { studentProfileId: number; grade: number | null; feedback: string | null }) => createHTTPRequest<{ success: boolean }, typeof body>({ path: `${base}/activities/${activityId}/grade`, method: 'PUT', body }),
};
