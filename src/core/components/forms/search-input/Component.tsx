import { Field, Input } from '@chakra-ui/react';
import { useEffect } from 'react';

import { componentColors } from '../../localStyles';

type SearchInputProps = {
	label: string;
	placeholder?: string;
	value: string;
	onValueChange: (value: string) => void;
	onDebouncedChange?: (value: string) => void;
	debounceMs?: number;
};

export function SearchInput({
	label,
	placeholder,
	value,
	onValueChange,
	onDebouncedChange,
	debounceMs = 250,
}: SearchInputProps) {
	useEffect(() => {
		if (!onDebouncedChange) return undefined;
		const timeoutId = window.setTimeout(() => {
			onDebouncedChange(value);
		}, debounceMs);

		return () => window.clearTimeout(timeoutId);
	}, [debounceMs, onDebouncedChange, value]);

	return (
		<Field.Root>
			<Field.Label
				fontSize='0.8125rem'
				lineHeight='1.25rem'
				fontWeight='medium'
				color={componentColors.light.text}
			>
				{label}
			</Field.Label>
			<Input
				w='full'
				value={value}
				px='0.75rem'
				py='0.5rem'
				onChange={(event) => onValueChange(event.target.value)}
				placeholder={placeholder}
				fontSize='0.8125rem'
				lineHeight='1.25rem'
				transition='all 0.22s ease'
				bg={componentColors.light.background}
				borderColor={componentColors.light.border}
				color={componentColors.light.text}
				_hover={{
					borderColor: componentColors.light.borderHover,
					bg: componentColors.light.surface,
				}}
				_focusVisible={{
					borderColor: componentColors.light.borderHover,
					boxShadow: `0 0 0 3px ${componentColors.light.focusRing}`,
					bg: componentColors.light.surface,
				}}
				_focus={{
					borderColor: componentColors.light.borderHover,
					bg: componentColors.light.surface,
				}}
				_dark={{
					bg: componentColors.dark.background,
					borderColor: componentColors.dark.border,
					color: componentColors.dark.text,
					_hover: {
						borderColor: componentColors.dark.borderHover,
						bg: componentColors.dark.surface,
					},
					_focusVisible: {
						borderColor: componentColors.dark.borderHover,
						boxShadow: `0 0 0 3px ${componentColors.dark.focusRing}`,
						bg: componentColors.dark.surface,
					},
					_focus: {
						borderColor: componentColors.dark.borderHover,
						bg: componentColors.dark.surface,
					},
				}}
			/>
		</Field.Root>
	);
}
