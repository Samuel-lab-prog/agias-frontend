export type AcademicPeriod = {
	id: number;
	code: string;
	year: number;
	term: number;
	startsAt: string;
	endsAt: string;
};
export type ClassOffering = Record<string, unknown>;
export type CreateAcademicPeriodBody = Record<string, unknown>;
export type CreateClassOfferingBody = Record<string, unknown>;
