import type { StudentDashboardSession } from '@Api/academic/types';
import { Badge, HStack } from '@chakra-ui/react';

import { lessonState } from '../utils/academic-planning';

export function LessonStatusBadge({ session }: { session: StudentDashboardSession }) {
	const state = lessonState(session);
	const color =
		state.status === 'completed'
			? 'green'
			: state.status === 'cancelled' || state.status === 'missed'
				? 'red'
				: 'blue';
	return (
		<HStack gap={1} flexWrap='wrap'>
			<Badge colorPalette={color}>{state.label}</Badge>
			{state.isReplacement ? <Badge colorPalette='purple'>Reposição</Badge> : null}
		</HStack>
	);
}
