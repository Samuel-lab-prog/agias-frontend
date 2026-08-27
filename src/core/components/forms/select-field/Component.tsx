import { Box, Field, Icon, NativeSelect } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
	type Control,
	Controller,
	type FieldErrors,
	type FieldValues,
	type Path,
} from 'react-hook-form';

import { hoverSubtle } from '../../../utils/interaction';

const subtleMotion = hoverSubtle();

interface Option {
	value: string;
	label: string;
}

interface SelectFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	options: Option[];
	error?: FieldErrors<T>;
	required?: boolean;
	placeholder?: string;
	disabled?: boolean;
	transformValue?: (value: string) => unknown;
}

export function SelectField<T extends FieldValues>({
	control,
	name,
	label,
	options,
	error,
	required,
	disabled,
	placeholder,
	transformValue,
}: SelectFieldProps<T>) {
	const errorMessage = error?.message?.toString();
	const hasError = Boolean(errorMessage);
	const [isFocused, setIsFocused] = useState(false);

	return (
		<Field.Root required={required} invalid={!!error} w='full'>
			<Field.Label
				textStyle='smaller'
				fontWeight='medium'
				color={hasError ? 'error' : 'text'}
				transition={subtleMotion.transition}
			>
				{label}
				{required && <Field.RequiredIndicator />}
			</Field.Label>

			<Controller
				disabled={disabled}
				name={name}
				control={control}
				rules={{
					required: required ? 'This field is required.' : false,
				}}
				render={({ field }) => (
					<NativeSelect.Root
						size='md'
						w='full'
						animationName='fade-in'
						animationDuration='260ms'
						animationTimingFunction='ease-out'
					>
						<NativeSelect.Field
							textStyle='smaller'
							bg='background'
							border='1px solid'
							borderColor={hasError ? 'error' : 'border'}
							borderRadius='md'
							color='text'
							px={3}
							py={2}
							pe={14}
							transition={subtleMotion.transition}
							_hover={{
								...subtleMotion.hover,
								borderColor: hasError ? 'error' : 'borderHover',
								bg: 'surface',
							}}
							_focusVisible={{
								...subtleMotion.focusVisible,
								borderColor: hasError ? 'error' : 'borderHover',
								boxShadow: hasError ? '0 0 0 5px {colors.error}' : '0 0 0 5px {colors.focusRing}',
								bg: 'surface',
							}}
							_disabled={{
								opacity: 0.65,
								cursor: 'not-allowed',
							}}
							value={field.value ?? ''}
							onChange={(e) => {
								const value = e.target.value;
								field.onChange(transformValue ? transformValue(value) : value);
							}}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
						>
							{placeholder && (
								<option value='' disabled style={{ color: 'var(--chakra-colors-textMuted)' }}>
									{placeholder}
								</option>
							)}

							{options.map((option) => (
								<option
									key={option.value}
									value={option.value}
									style={{
										backgroundColor: 'var(--chakra-colors-background)',
										color: 'var(--chakra-colors-text)',
									}}
								>
									{option.label}
								</option>
							))}
						</NativeSelect.Field>

						<NativeSelect.Indicator
							pointerEvents='none'
							px={2}
							h='70%'
							right={1}
							borderRadius='md'
							bg='accentSoft'
							border='1px solid'
							borderColor={hasError ? 'error' : 'border'}
							color={hasError ? 'error' : isFocused ? 'text' : 'textMuted'}
							transition={subtleMotion.transition}
							transform={isFocused ? 'translateY(-1px)' : 'translateY(0)'}
						>
							<Icon
								as={ChevronDown}
								boxSize={4}
								transition={subtleMotion.transition}
								transform={isFocused ? 'rotate(180deg)' : 'rotate(0deg)'}
							/>
						</NativeSelect.Indicator>
					</NativeSelect.Root>
				)}
			/>

			<Box
				display='grid'
				gridTemplateRows={hasError ? '1fr' : '0fr'}
				transition='grid-template-rows 0.24s ease'
			>
				<Field.ErrorText
					color='error'
					opacity={hasError ? 1 : 0}
					transform={hasError ? 'translateY(0)' : 'translateY(-3px)'}
					overflow='hidden'
					minH={0}
					mt={hasError ? 1 : 0}
					transition='opacity 0.2s ease, transform 0.2s ease, margin-top 0.2s ease'
				>
					{errorMessage}
				</Field.ErrorText>
			</Box>
		</Field.Root>
	);
}
