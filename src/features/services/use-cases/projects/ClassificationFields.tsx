import {
	type CatalogEntry,
	catalogFields,
	catalogLabels,
	type ClassificationIds,
	parentFields,
} from '@Api/projects/catalogs';
import type { ProjectKind } from '@Api/projects/endpoints';
import { SimpleGrid, Text } from '@chakra-ui/react';

import { SearchSelect } from './SearchSelect';

export function ClassificationFields({
	entries,
	value,
	onChange,
	kind,
	historical = false,
	previous = {},
	disabled = false,
}: {
	entries: CatalogEntry[];
	value: ClassificationIds;
	onChange: (value: ClassificationIds) => void;
	kind?: ProjectKind | '';
	historical?: boolean;
	previous?: ClassificationIds;
	disabled?: boolean;
}) {
	return (
		<>
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
				{catalogFields.map((field) => {
					const key = `${field}Id` as const;
					const parent = parentFields[field];
					const parentId = parent ? value[`${parent}Id`] : null;
					const options = entries.filter(
						(entry) =>
							entry.type === field &&
							(historical || entry.active || previous[key] === entry.id) &&
							(!kind || !entry.kind || kind === entry.kind) &&
							(!parentId || !entry.parentId || entry.parentId === parentId),
					);
					return (
						<SearchSelect
							key={field}
							label={catalogLabels[field]}
							value={value[key]}
							options={options}
							disabled={disabled}
							placeholder={
								historical ? 'Todas — digite para buscar' : 'Não informado — selecione uma opção'
							}
							emptyText='Nenhuma opção disponível. A gestão pode cadastrar opções em Catálogos de projetos.'
							onChange={(id) => {
								const next = { ...value, [key]: id };
								const selected = entries.find((entry) => entry.id === id);
								if (parent && selected?.parentId) next[`${parent}Id`] = selected.parentId;
								for (const child of catalogFields.filter(
									(candidate) => parentFields[candidate] === field,
								)) {
									const childEntry = entries.find((entry) => entry.id === next[`${child}Id`]);
									if (childEntry?.parentId && childEntry.parentId !== id) next[`${child}Id`] = null;
								}
								onChange(next);
							}}
						/>
					);
				})}
			</SimpleGrid>
			{!historical && (
				<Text fontSize='sm' color='fg.muted'>
					Campos vazios significam “não informado”. Natureza identifica a categoria institucional do
					projeto; tipo de pesquisa identifica sua classificação de pesquisa.
				</Text>
			)}
		</>
	);
}
