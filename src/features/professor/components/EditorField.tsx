import { Field } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export function EditorField({
	label,
	hint,
	required,
	children,
}: {
	label: string;
	hint?: string;
	required?: boolean;
	children: ReactNode;
}) {
	return (
		<Field.Root required={required}>
			<Field.Label fontSize='sm'>
				{label}
				{required && <Field.RequiredIndicator />}
			</Field.Label>
			{children}
			{hint && <Field.HelperText color='fg.muted'>{hint}</Field.HelperText>}
		</Field.Root>
	);
}
