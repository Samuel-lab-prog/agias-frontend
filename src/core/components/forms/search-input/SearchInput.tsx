import { Field, Input } from '@chakra-ui/react';
import { useEffect } from 'react';

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
			<Field.Label fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='medium' color='fg.default'>
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
				bg='bg.canvas'
				borderColor='border.default'
				color='fg.default'
				_hover={{
					borderColor: 'border.interactive',
					bg: 'bg.surface',
				}}
				_focusVisible={{
					borderColor: 'border.interactive',
					boxShadow: `0 0 0 3px ${'focus.ring'}`,
					bg: 'bg.surface',
				}}
				_focus={{
					borderColor: 'border.interactive',
					bg: 'bg.surface',
				}}
				_dark={{
					bg: 'bg.canvas',
					borderColor: 'border.default',
					color: 'fg.default',
					_hover: {
						borderColor: 'border.interactive',
						bg: 'bg.surface',
					},
					_focusVisible: {
						borderColor: 'border.interactive',
						boxShadow: `0 0 0 3px ${'focus.ring'}`,
						bg: 'bg.surface',
					},
					_focus: {
						borderColor: 'border.interactive',
						bg: 'bg.surface',
					},
				}}
			/>
		</Field.Root>
	);
}
