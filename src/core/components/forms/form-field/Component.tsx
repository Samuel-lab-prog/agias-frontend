import { Box, Field, Input, Text, Textarea } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';

import { hoverSubtle } from '../../../utils/interaction';
import { componentColors } from '../../localStyles';
import { useAsyncValidation } from './hooks';
import type { FormFieldProps } from './types';

const subtleMotion = hoverSubtle();

/**
 * Form-friendly input/textarea field with optional async validation,
 * length counters, and consistent error display.
 */

export function FormField<T extends FieldValues>({
	control,
	name,
	label,
	required,
	error,
	as = 'input',
	rows,
	minLength,
	maxLength,
	showCharacterCount = false,
	type,
	transformValue,
	asyncValidator,
	debounce,
	setError,
	clearErrors,
	disabled,
	autoFocus,
}: FormFieldProps<T>) {
	const Component = as === 'textarea' ? Textarea : Input;
	const debounceRef = useRef<number | null>(null);
	const validationRunRef = useRef(0);
	const hasOwnValidationErrorRef = useRef(false);

	const { scheduleValidation, clearValidationState } = useAsyncValidation({
		name,
		asyncValidator,
		setError,
		clearErrors,
		debounce,
		debounceRef,
		validationRunRef,
		hasOwnValidationErrorRef,
	});

	// eslint-disable-next-line arrow-body-style
	useEffect(() => {
		return () => {
			clearValidationState();
		};
	}, [clearValidationState]);

	return (
		<Controller
			name={name}
			control={control}
			rules={{
				required: required ? 'This field is required.' : false,
				minLength:
					typeof minLength === 'number'
						? { value: minLength, message: `Minimum length is ${minLength} characters.` }
						: undefined,
				maxLength:
					typeof maxLength === 'number'
						? { value: maxLength, message: `Maximum length is ${maxLength} characters.` }
						: undefined,
			}}
			render={({ field, fieldState }) => {
				const resolvedError = fieldState.error ?? error;
				const errorMessage = resolvedError?.message?.toString();
				const hasError = Boolean(errorMessage);
				const valueAsString = typeof field.value === 'string' ? field.value : '';
				const currentLength = valueAsString.length;
				const isBelowMinLength = typeof minLength === 'number' && currentLength < minLength;
				const shouldShowCharacterCount = showCharacterCount && typeof maxLength === 'number';

				return (
					<Field.Root required={required} invalid={hasError}>
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

						<Component
							{...field}
							fontSize='0.8125rem'
							lineHeight='1.25rem'
							transition={subtleMotion.transition}
							bg={componentColors.light.background}
							borderColor={hasError ? componentColors.light.error : componentColors.light.border}
							color={componentColors.light.text}
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
								boxShadow: `0 0 0 3px ${
									hasError ? componentColors.light.errorSoft : componentColors.light.focusRing
								}`,
								bg: componentColors.light.surface,
							}}
							_focus={{
								borderColor: hasError
									? componentColors.light.error
									: componentColors.light.borderHover,
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
									boxShadow: `0 0 0 3px ${
										hasError ? componentColors.dark.errorSoft : componentColors.dark.focusRing
									}`,
									bg: componentColors.dark.surface,
								},
								_focus: {
									borderColor: hasError
										? componentColors.dark.error
										: componentColors.dark.borderHover,
									bg: componentColors.dark.surface,
								},
							}}
							autoFocus={autoFocus}
							rows={as === 'textarea' ? rows : undefined}
							minLength={minLength}
							maxLength={maxLength}
							type={type}
							value={field.value ?? ''}
							disabled={disabled}
							onChange={(e) => {
								const rawValue = e.target.value;
								const nextValue = transformValue ? transformValue(rawValue) : rawValue;

								field.onChange(nextValue);

								scheduleValidation(rawValue);
							}}
						/>

						<Box
							display='grid'
							gridTemplateRows={hasError ? '1fr' : '0fr'}
							transition='grid-template-rows 0.24s ease'
						>
							<Field.ErrorText
								fontSize='0.8125rem'
								lineHeight='1.25rem'
								color={componentColors.light.error}
								_dark={{ color: componentColors.dark.error }}
								opacity={hasError ? 1 : 0}
								transform={hasError ? 'translateY(0)' : 'translateY(-3px)'}
								overflow='hidden'
								minH={0}
								transition={subtleMotion.transition}
							>
								{errorMessage}
							</Field.ErrorText>
						</Box>

						{shouldShowCharacterCount && (
							<Text
								fontSize='0.8125rem'
								lineHeight='1.25rem'
								color={
									isBelowMinLength ? componentColors.light.error : componentColors.light.textMuted
								}
								_dark={{
									color: isBelowMinLength
										? componentColors.dark.error
										: componentColors.dark.textMuted,
								}}
								w='full'
								textAlign='right'
							>
								{currentLength}/{maxLength} characters
							</Text>
						)}
					</Field.Root>
				);
			}}
		/>
	);
}
