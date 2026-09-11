import { curriculum } from '@Api/curriculum/endpoints';
import { curriculumKeys } from '@Api/curriculum/keys';
import { staffCurriculum, staffCurriculumKeys } from '@Api/curriculum/staff';
import { toaster } from '@BaseComponents';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function errorMessage(error: unknown) {
	return error && typeof error === 'object' && 'message' in error
		? String(error.message)
		: 'Não foi possível concluir a solicitação. Tente novamente.';
}
export function useSearch() {
	const [text, setText] = useState('');
	const [query, setQuery] = useState('');
	useEffect(() => {
		const timer = setTimeout(() => setQuery(text.trim()), 300);
		return () => clearTimeout(timer);
	}, [text]);
	return { text, setText, query };
}
export function useStaffQuery<T>(
	key: readonly unknown[],
	queryFn: () => Promise<T>,
	enabled = true,
) {
	const userId = useAuthClientStore((state) => state.authClient?.id);
	return useQuery({
		queryKey: [...staffCurriculumKeys.all, userId, ...key],
		queryFn,
		enabled: !!userId && enabled,
		staleTime: 30_000,
	});
}
export function useClassOptions() {
	const courses = useStaffQuery(['courses'], staffCurriculum.courses);
	const periods = useQuery({
		queryKey: curriculumKeys.academicPeriods(),
		queryFn: () => curriculum.getAcademicPeriods.query().queryFn(),
		staleTime: 60_000,
	});
	return { courses, periods };
}
export function useStaffMutation<T, R>(
	mutationFn: (input: T) => Promise<R>,
	title: string,
	afterSave?: (result: R) => void,
) {
	const client = useQueryClient();
	return useMutation({
		mutationFn,
		onSuccess: async (result) => {
			await Promise.all([
				client.invalidateQueries({ queryKey: staffCurriculumKeys.all }),
				client.invalidateQueries({ queryKey: ['academic'] }),
				client.invalidateQueries({ queryKey: ['academic-calendar', 'students'] }),
			]);
			toaster.create({ title, type: 'success' });
			afterSave?.(result);
		},
	});
}
