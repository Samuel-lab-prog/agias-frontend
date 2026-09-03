import { Box, Field, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { Controller, type FieldError, type FieldValues, type Path } from 'react-hook-form';

import { hoverSubtle } from '../../../utils/interaction';

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
							color={hasError ? 'status.error' : 'fg.default'}
							transition={subtleMotion.transition}
							_dark={{
								color: hasError ? 'status.error' : 'fg.default',
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
									borderRadius='md'
									border='1px solid'
									borderColor={hasError ? 'status.error' : 'border.default'}
									bg={swatchValue}
									boxShadow={`inset 0 0 0 1px ${'bg.canvas'}`}
									cursor={disabled ? 'not-allowed' : 'pointer'}
									overflow='hidden'
									transition={subtleMotion.transition}
									_hover={
										disabled
											? undefined
											: {
													...subtleMotion.hover,
													borderColor: hasError ? 'status.error' : 'border.interactive',
												}
									}
									_dark={{
										borderColor: hasError ? 'status.error' : 'border.default',
										boxShadow: `inset 0 0 0 1px ${'bg.canvas'}`,
										_hover: disabled
											? undefined
											: {
													borderColor: hasError ? 'status.error' : 'border.interactive',
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
									bg='bg.canvas'
									border='1px solid'
									borderColor={hasError ? 'status.error' : 'border.default'}
									borderRadius='md'
									color='fg.default'
									px='0.75rem'
									py='0.5rem'
									transition={subtleMotion.transition}
									_hover={{
										...subtleMotion.hover,
										borderColor: hasError ? 'status.error' : 'border.interactive',
										bg: 'bg.surface',
									}}
									_focusVisible={{
										...subtleMotion.focusVisible,
										borderColor: hasError ? 'status.error' : 'border.interactive',
										boxShadow: `0 0 0 3px ${hasError ? 'status.errorSubtle' : 'focus.ring'}`,
										bg: 'bg.surface',
									}}
									_dark={{
										bg: 'bg.canvas',
										borderColor: hasError ? 'status.error' : 'border.default',
										color: 'fg.default',
										_hover: {
											borderColor: hasError ? 'status.error' : 'border.interactive',
											bg: 'bg.surface',
										},
										_focusVisible: {
											borderColor: hasError ? 'status.error' : 'border.interactive',
											boxShadow: `0 0 0 3px ${hasError ? 'status.errorSubtle' : 'focus.ring'}`,
											bg: 'bg.surface',
										},
									}}
								/>
							</Flex>

							{helperText ? (
								<Text
									fontSize='0.8125rem'
									lineHeight='1.25rem'
									color='fg.muted'
									_dark={{ color: 'fg.muted' }}
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
									color='status.error'
									_dark={{ color: 'status.error' }}
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
