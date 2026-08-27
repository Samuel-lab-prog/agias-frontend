import { Box, Field, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { Controller, type FieldError, type FieldValues, type Path } from 'react-hook-form';

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
				const value = normalizeColorValue((field.value as string | null | undefined) ?? '#000000', allowAlpha);
				const swatchValue = value || '#000000';

				return (
					<Field.Root required={required} invalid={Boolean(resolvedErrorMessage)} w='full'>
						<Field.Label
							textStyle='smaller'
							fontWeight='medium'
							color={hasError ? 'error' : 'text'}
							transition='color 0.22s ease'
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
									boxShadow='inset 0 0 0 1px rgba(255,255,255,0.25)'
									cursor={disabled ? 'not-allowed' : 'pointer'}
									overflow='hidden'
									transition='transform 0.18s ease, border-color 0.2s ease, box-shadow 0.2s ease'
									_hover={
										disabled
											? undefined
											: {
													transform: 'translateY(-1px)',
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
									onChange={(event) => field.onChange(normalizeColorValue(event.target.value, allowAlpha))}
									disabled={disabled}
									placeholder={allowAlpha ? '#RRGGBBAA' : '#RRGGBB'}
									textStyle='smaller'
									bg='rgba(255, 255, 255, 0.03)'
									border='1px solid'
									borderColor={hasError ? 'error' : 'border'}
									borderRadius='md'
									px={3}
									py={2}
									transition='all 0.22s ease'
									_hover={{
										borderColor: hasError ? 'error' : 'borderHover',
										bg: 'rgba(255, 255, 255, 0.05)',
									}}
									_focusVisible={{
										borderColor: hasError ? 'error' : 'borderHover',
										boxShadow: hasError
											? '0 0 0 3px rgba(239, 68, 68, 1)'
											: '0 0 0 3px rgba(0, 0, 0, 0.18)',
										bg: 'rgba(255, 255, 255, 0.06)',
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
									transition='opacity 0.2s ease, transform 0.2s ease, margin-top 0.2s ease'
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
