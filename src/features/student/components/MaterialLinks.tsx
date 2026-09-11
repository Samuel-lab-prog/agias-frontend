import { Link, Text, VStack } from '@chakra-ui/react';

import { isSafeMaterialUrl } from '../utils/academic-planning';

export function MaterialLinks({
	materials,
}: {
	materials: Array<{ id: number; title: string; url: string }>;
}) {
	if (!materials.length)
		return (
			<Text fontSize='sm' color='fg.muted'>
				Nenhum material publicado.
			</Text>
		);
	return (
		<VStack align='stretch' gap={2}>
			{materials.map((material) =>
				isSafeMaterialUrl(material.url) ? (
					<Link
						key={material.id}
						href={material.url}
						target='_blank'
						rel='noopener noreferrer'
						color='action.primary'
						textDecoration='underline'
						fontSize='sm'
					>
						{material.title} (abre em nova aba)
					</Link>
				) : (
					<Text key={material.id} fontSize='sm'>
						{material.title} — link indisponível
					</Text>
				),
			)}
		</VStack>
	);
}
