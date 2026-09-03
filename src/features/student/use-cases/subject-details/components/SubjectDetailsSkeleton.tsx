import { Surface } from '@BaseComponents';
import { Skeleton, VStack } from '@chakra-ui/react';

export function SubjectDetailsSkeleton() {
	return (
		<VStack align='stretch' gap={4} aria-label='Carregando detalhes da disciplina'>
			{[180, 220, 260].map((height) => (
				<Surface key={height} variant='panel'>
					<Skeleton height={`${height}px`} borderRadius='lg' />
				</Surface>
			))}
		</VStack>
	);
}
