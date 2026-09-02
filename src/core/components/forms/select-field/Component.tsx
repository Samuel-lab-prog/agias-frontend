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
import { componentColors, componentRadii } from '../../localStyles';

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
				fontSize='0.8125rem'
				lineHeight='1.25rem'
				fontWeight='medium'
				color={hasError ? componentColors.light.error : componentColors.light.text}
				transition={subtleMotion.transition}
				_dark={{
					color: hasError ? componentColors.dark.error : componentColors.dark.text,
				}}
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
							fontSize='0.8125rem'
							lineHeight='1.25rem'
							bg={componentColors.light.background}
							border='1px solid'
							borderColor={hasError ? componentColors.light.error : componentColors.light.border}
							borderRadius={componentRadii.md}
							color={componentColors.light.text}
							px='0.75rem'
							py='0.5rem'
							pe={14}
							transition={subtleMotion.transition}
							_hover={{
								...subtleMotion.hover,
								borderColor: hasError
									? componentColors.light.error
									: componentColors.light.borderHover,
								bg: componentColors.light.surface,
							}}
							_focusVisible={{
								...subtleMotion.focusVisible,
								borderColor: hasError
									? componentColors.light.error
									: componentColors.light.borderHover,
								boxShadow: `0 0 0 5px ${
									hasError ? componentColors.light.errorSoft : componentColors.light.focusRing
								}`,
								bg: componentColors.light.surface,
							}}
							_dark={{
								bg: componentColors.dark.background,
								borderColor: hasError ? componentColors.dark.error : componentColors.dark.border,
								color: componentColors.dark.text,
								_hover: {
									borderColor: hasError
										? componentColors.dark.error
										: componentColors.dark.borderHover,
									bg: componentColors.dark.surface,
								},
								_focusVisible: {
									borderColor: hasError
										? componentColors.dark.error
										: componentColors.dark.borderHover,
									boxShadow: `0 0 0 5px ${
										hasError ? componentColors.dark.errorSoft : componentColors.dark.focusRing
									}`,
									bg: componentColors.dark.surface,
								},
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
								<option value='' disabled style={{ color: componentColors.light.textMuted }}>
									{placeholder}
								</option>
							)}

							{options.map((option) => (
								<option
									key={option.value}
									value={option.value}
									style={{
										backgroundColor: componentColors.light.background,
										color: componentColors.light.text,
									}}
								>
									{option.label}
								</option>
							))}
						</NativeSelect.Field>

						<NativeSelect.Indicator
							pointerEvents='none'
							px='0.5rem'
							h='70%'
							right={1}
							borderRadius={componentRadii.md}
							bg={componentColors.light.accentSoft}
							border='1px solid'
							borderColor={hasError ? componentColors.light.error : componentColors.light.border}
							color={
								hasError
									? componentColors.light.error
									: isFocused
										? componentColors.light.text
										: componentColors.light.textMuted
							}
							transition={subtleMotion.transition}
							transform={isFocused ? 'translateY(-1px)' : 'translateY(0)'}
							_dark={{
								bg: componentColors.dark.accentSoft,
								borderColor: hasError ? componentColors.dark.error : componentColors.dark.border,
								color: hasError
									? componentColors.dark.error
									: isFocused
										? componentColors.dark.text
										: componentColors.dark.textMuted,
							}}
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
					color={componentColors.light.error}
					_dark={{ color: componentColors.dark.error }}
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
