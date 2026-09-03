import { Avatar, Box, Field, Flex, Input, Text, VisuallyHidden } from '@chakra-ui/react';
import { useMemo, useRef } from 'react';
import { Controller, type FieldValues, useWatch } from 'react-hook-form';

import { hoverSubtle } from '../../../utils/interaction';
import { BaseButton } from '../../Button';
import { useFilePreview } from './hooks';
import type { FileFieldProps } from './types';
import { buildFileValidationRules } from './utils';

const subtleMotion = hoverSubtle();

export function FileField<T extends FieldValues>({
	control,
	name,
	label,
	required,
	error,
	accept,
	buttonLabel = 'Choose file',
	helpText,
	preview = 'none',
	disabled,
	validateFile,
}: FileFieldProps<T>) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const watchedFile = useWatch({ control, name }) as File | null | undefined;
	const previewUrl = useFilePreview(watchedFile);

	const rules = useMemo(() => buildFileValidationRules(validateFile), [validateFile]);

	return (
		<Controller
			name={name}
			control={control}
			rules={{
				required: required ? 'This field is required.' : false,
				...rules,
			}}
			render={({ field, fieldState }) => {
				const resolvedError = fieldState.error ?? error;
				const errorMessage = resolvedError?.message?.toString();
				const hasError = Boolean(errorMessage);
				const file = field.value as File | null | undefined;

				return (
					<Field.Root required={required} invalid={hasError}>
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

						{preview !== 'none' && previewUrl && (
							<Box mb={3} mt={1}>
								{preview === 'image' && (
									<Avatar.Root size='md'>
										<Avatar.Image src={previewUrl} />
										<Avatar.Fallback name='Avatar' />
									</Avatar.Root>
								)}
								{preview === 'audio' && <audio controls preload='metadata' src={previewUrl} />}
							</Box>
						)}

						<Flex align='center' gap={3} wrap='wrap'>
							<BaseButton
								as='label'
								size='sm'
								variant='secondary'
								cursor='pointer'
								disabled={disabled}
							>
								{buttonLabel}
								<VisuallyHidden>
									<Input
										ref={inputRef}
										type='file'
										accept={accept}
										onChange={(event) => {
											const nextFile = event.target.files?.[0] ?? null;
											field.onChange(nextFile);
										}}
										disabled={disabled}
									/>
								</VisuallyHidden>
							</BaseButton>
							<Text
								fontSize='0.8125rem'
								lineHeight='1.25rem'
								color={'fg.muted'}
								_dark={{ color: 'fg.muted' }}
							>
								{file ? file.name : 'File not selected'}
							</Text>
						</Flex>

						{helpText && (
							<Text
								fontSize='0.8125rem'
								lineHeight='1.25rem'
								color={'fg.muted'}
								mt={2}
								_dark={{ color: 'fg.muted' }}
							>
								{helpText}
							</Text>
						)}

						<Box
							display='grid'
							gridTemplateRows={hasError ? '1fr' : '0fr'}
							transition='grid-template-rows 0.24s ease'
						>
							<Field.ErrorText
								color={'status.error'}
								_dark={{ color: 'status.error' }}
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
			}}
		/>
	);
}
