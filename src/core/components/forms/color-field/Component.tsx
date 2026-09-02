import { Box, Field, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { Controller, type FieldError, type FieldValues, type Path } from 'react-hook-form';

import { hoverSubtle } from '../../../utils/interaction';
import { componentColors, componentRadii } from '../../localStyles';

const subtleMotion = hoverSubtle();

type ColorFieldProps<T extends FieldValues> = {
	control: import('react-hook-form').Control<T>;
	name: Path<T>;
	label: string;
	required?: boolean;
	error?: FieldError;
	helperText?: string;
	disabled?: boolean;
	allowAlpha?: boolean;
};

function normalizeColorValue(value: string, allowAlpha: boolean) {
	const trimmed = value.trim();
	if (!trimmed) return '';

	if (!trimmed.startsWith('#')) return trimmed;

	const hex = trimmed.slice(1);
	if (allowAlpha) {
		if (hex.length === 8) return `#${hex.toLowerCase()}`;
		if (hex.length === 6) return `#${hex.toLowerCase()}`;
	}

	if (hex.length === 3 || hex.length === 6) return `#${hex.toLowerCase()}`;
	return trimmed.toLowerCase();
}

export function ColorField<T extends FieldValues>({
	control,
	name,
	label,
	required,
	error,
	helperText,
	disabled,
	allowAlpha = false,
}: ColorFieldProps<T>) {
	const errorMessage = error?.message?.toString();
	const hasError = Boolean(errorMessage);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const resolvedError = fieldState.error ?? error;
				const resolvedErrorMessage = resolvedError?.message?.toString();
				const value = normalizeColorValue(
					(field.value as string | null | undefined) ?? '#000000',
					allowAlpha,
				);
				const swatchValue = value || '#000000';

				return (
					<Field.Root required={required} invalid={Boolean(resolvedErrorMessage)} w='full'>
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

						<Stack gap={2}>
							<Flex gap={3} align='center'>
								<Box
									as='label'
									position='relative'
									flexShrink={0}
									w='44px'
									h='44px'
									borderRadius={componentRadii.md}
									border='1px solid'
									borderColor={
										hasError ? componentColors.light.error : componentColors.light.border
									}
									bg={swatchValue}
									boxShadow={`inset 0 0 0 1px ${componentColors.light.background}`}
									cursor={disabled ? 'not-allowed' : 'pointer'}
									overflow='hidden'
									transition={subtleMotion.transition}
									_hover={
										disabled
											? undefined
											: {
													...subtleMotion.hover,
													borderColor: hasError
														? componentColors.light.error
														: componentColors.light.borderHover,
												}
									}
									_dark={{
										borderColor: hasError
											? componentColors.dark.error
											: componentColors.dark.border,
										boxShadow: `inset 0 0 0 1px ${componentColors.dark.background}`,
										_hover: disabled
											? undefined
											: {
													borderColor: hasError
														? componentColors.dark.error
														: componentColors.dark.borderHover,
												},
									}}
								>
									<Input
										type='color'
										value={value || '#000000'}
										disabled={disabled}
										onChange={(event) => {
											field.onChange(normalizeColorValue(event.currentTarget.value, allowAlpha));
										}}
										aria-label={label}
										opacity={0}
										position='absolute'
										inset={0}
										w='full'
										h='full'
										cursor='inherit'
									/>
								</Box>

								<Input
									value={value}
									onChange={(event) =>
										field.onChange(normalizeColorValue(event.target.value, allowAlpha))
									}
									disabled={disabled}
									placeholder={allowAlpha ? '#RRGGBBAA' : '#RRGGBB'}
									fontSize='0.8125rem'
									lineHeight='1.25rem'
									bg={componentColors.light.background}
									border='1px solid'
									borderColor={
										hasError ? componentColors.light.error : componentColors.light.border
									}
									borderRadius={componentRadii.md}
									color={componentColors.light.text}
									px='0.75rem'
									py='0.5rem'
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
										boxShadow: `0 0 0 3px ${
											hasError ? componentColors.light.errorSoft : componentColors.light.focusRing
										}`,
										bg: componentColors.light.surface,
									}}
									_dark={{
										bg: componentColors.dark.background,
										borderColor: hasError
											? componentColors.dark.error
											: componentColors.dark.border,
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
									}}
								/>
							</Flex>

							{helperText ? (
								<Text
									fontSize='0.8125rem'
									lineHeight='1.25rem'
									color={componentColors.light.textMuted}
									_dark={{ color: componentColors.dark.textMuted }}
								>
									{helperText}
								</Text>
							) : null}

							<Box
								display='grid'
								gridTemplateRows={resolvedErrorMessage ? '1fr' : '0fr'}
								transition='grid-template-rows 0.24s ease'
							>
								<Field.ErrorText
									color={componentColors.light.error}
									_dark={{ color: componentColors.dark.error }}
									opacity={resolvedErrorMessage ? 1 : 0}
									transform={resolvedErrorMessage ? 'translateY(0)' : 'translateY(-3px)'}
									overflow='hidden'
									minH={0}
									mt={resolvedErrorMessage ? 1 : 0}
									transition={subtleMotion.transition}
								>
									{resolvedErrorMessage}
								</Field.ErrorText>
							</Box>
						</Stack>
					</Field.Root>
				);
			}}
		/>
	);
}
