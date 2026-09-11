import { BaseButton, ErrorStateCard } from '@BaseComponents';
import { Field as ChakraField, HStack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { errorMessage } from './hooks';

export function FieldLabel({
	label,
	children,
	required,
	disabled,
}: {
	label: string;
	children: ReactNode;
	required?: boolean;
	disabled?: boolean;
}) {
	return (
		<ChakraField.Root required={required} disabled={disabled}>
			<ChakraField.Label fontSize='sm' fontWeight='semibold'>
				{label}
			</ChakraField.Label>
			{children}
		</ChakraField.Root>
	);
}
export function RequestError({ error, retry }: { error: unknown; retry?: () => void }) {
	return error ? (
		<ErrorStateCard
			eyebrow='GESTÃO ACADÊMICA'
			title='Não foi possível concluir'
			description={errorMessage(error)}
			actionLabel='Tentar novamente'
			onAction={retry}
		/>
	) : null;
}
export function Pagination({
	page,
	total,
	pageSize,
	onChange,
	disabled,
}: {
	page: number;
	total: number;
	pageSize: number;
	onChange: (page: number) => void;
	disabled?: boolean;
}) {
	const pages = Math.max(1, Math.ceil(total / pageSize));
	return (
		<HStack justify='space-between' flexWrap='wrap' gap={3} mt={3}>
			<Text fontSize='sm' color='fg.muted' role='status'>
				{total} registro{total === 1 ? '' : 's'} · Página {page} de {pages}
			</Text>
			<HStack>
				<BaseButton
					size='sm'
					variant='secondary'
					disabled={disabled || page <= 1}
					onClick={() => onChange(page - 1)}
				>
					Anterior
				</BaseButton>
				<BaseButton
					size='sm'
					variant='secondary'
					disabled={disabled || page >= pages}
					onClick={() => onChange(page + 1)}
				>
					Próxima
				</BaseButton>
			</HStack>
		</HStack>
	);
}
