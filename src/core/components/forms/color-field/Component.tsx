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
							textStyle='smaller'
							fontWeight='medium'
							color={hasError ? 'error' : 'text'}
							transition={subtleMotion.transition}
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
									borderColor={hasError ? 'error' : 'border'}
									bg={swatchValue}
									boxShadow='inset 0 0 0 1px {colors.background}'
									cursor={disabled ? 'not-allowed' : 'pointer'}
									overflow='hidden'
									transition={subtleMotion.transition}
									_hover={
										disabled
											? undefined
											: {
													...subtleMotion.hover,
													borderColor: hasError ? 'error' : 'borderHover',
												}
									}
								>
									<Box
										as='input'
										type='color'
										value={value || '#000000'}
										disabled={disabled}
										onChange={(event) => {
											field.onChange(normalizeColorValue(event.target.value, allowAlpha));
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
									textStyle='smaller'
									bg='background'
									border='1px solid'
									borderColor={hasError ? 'error' : 'border'}
									borderRadius='md'
									px={3}
									py={2}
									transition={subtleMotion.transition}
									_hover={{
										...subtleMotion.hover,
										borderColor: hasError ? 'error' : 'borderHover',
										bg: 'surface',
									}}
									_focusVisible={{
										...subtleMotion.focusVisible,
										borderColor: hasError ? 'error' : 'borderHover',
										boxShadow: hasError
											? '0 0 0 3px {colors.error}'
											: '0 0 0 3px {colors.focusRing}',
										bg: 'surface',
									}}
								/>
							</Flex>

							{helperText ? (
								<Text textStyle='smaller' color='textMuted'>
									{helperText}
								</Text>
							) : null}

							<Box
								display='grid'
								gridTemplateRows={resolvedErrorMessage ? '1fr' : '0fr'}
								transition='grid-template-rows 0.24s ease'
							>
								<Field.ErrorText
									color='error'
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
