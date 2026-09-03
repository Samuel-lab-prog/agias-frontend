import { Flex, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import { CircleAlert } from 'lucide-react';
import type { FieldValues } from 'react-hook-form';

import { FormButton } from '../form-button/FormButton';
import { FormCard } from '../styles/FormCardSurface';
import { renderDynamicField } from './renderField';
import type { DynamicFormProps } from './types';

/**
 * Renders a form dynamically based on a list of field descriptors.
 * Keeps layout, validation, and error display consistent across screens.
 */
export function DynamicForm<T extends FieldValues>({
	fields,
	control,
	errors,
	isValid,
	loading,
	columns = 1,
	generalError,
	onSubmit,
	buttonLabel,
	buttonVariant,
	setError,
	clearErrors,
	handleSubmitFn,
	extraContent,
	cardProps,
	renderers,
}: DynamicFormProps<T>) {
	return (
		<FormCard as='form' onSubmit={handleSubmitFn(onSubmit)} {...cardProps}>
			{generalError && (
				<Flex
					role='alert'
					aria-live='polite'
					align='center'
					gap={2.5}
					w='full'
					px='0.75rem'
					py='0.625rem'
					mb={2}
					border='1px solid'
					borderColor={'status.error'}
					borderRadius={'md'}
					bg={'bg.surface'}
					boxShadow='surface'
					animationName='shake-x, fade-in'
					animationDuration='240ms'
					_dark={{
						borderColor: 'status.error',
						bg: 'bg.surface',
					}}
				>
					<Flex
						align='center'
						justify='center'
						boxSize={7}
						borderRadius={'full'}
						bg={'bg.surface'}
						flexShrink={0}
						_dark={{ bg: 'bg.surface' }}
					>
						<Icon
							as={CircleAlert}
							boxSize={4}
							color={'status.error'}
							_dark={{ color: 'status.error' }}
						/>
					</Flex>
					<Text
						fontSize='0.8125rem'
						lineHeight='1.25rem'
						color={'status.error'}
						minH={7}
						display='flex'
						alignItems='center'
						_dark={{ color: 'status.error' }}
					>
						{generalError}
					</Text>
				</Flex>
			)}

			<SimpleGrid w='full' columns={columns} gap={4}>
				{fields.map((field, index) =>
					renderDynamicField({
						field,
						index,
						control,
						errors,
						isValid,
						loading,
						setError,
						clearErrors,
						renderers,
					}),
				)}
			</SimpleGrid>

			{extraContent}

			<FormButton isValid={isValid} loading={loading} variant={buttonVariant}>
				{buttonLabel}
			</FormButton>
		</FormCard>
	);
}
