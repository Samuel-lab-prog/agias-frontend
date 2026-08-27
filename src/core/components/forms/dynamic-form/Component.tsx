import { Flex, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import { CircleAlert } from 'lucide-react';
import type { FieldValues } from 'react-hook-form';

import { FormButton } from '../form-button/Component';
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
					px={3}
					py={2.5}
					mb={2}
					border='1px solid'
					borderColor='error'
					borderRadius='md'
					bg='surface'
					boxShadow='inset 0 1px 0 rgba(255, 255, 255, 0.02)'
					animationName='shake-x, fade-in'
					animationDuration='240ms'
				>
					<Flex
						align='center'
						justify='center'
						boxSize={7}
						borderRadius='full'
						bg='surface'
						flexShrink={0}
					>
						<Icon as={CircleAlert} boxSize={4} color='error' />
					</Flex>
					<Text
						textStyle='smaller'
						lineHeight='1.45'
						color='error'
						minH={7}
						display='flex'
						alignItems='center'
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
