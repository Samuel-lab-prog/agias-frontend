import { Flex, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import { CircleAlert } from 'lucide-react';
import type { FieldValues } from 'react-hook-form';

import { componentColors, componentRadii } from '../../localStyles';
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
					px='0.75rem'
					py='0.625rem'
					mb={2}
					border='1px solid'
					borderColor={componentColors.light.error}
					borderRadius={componentRadii.md}
					bg={componentColors.light.surface}
					boxShadow='inset 0 1px 0 rgba(255, 255, 255, 0.02)'
					animationName='shake-x, fade-in'
					animationDuration='240ms'
					_dark={{
						borderColor: componentColors.dark.error,
						bg: componentColors.dark.surface,
					}}
				>
					<Flex
						align='center'
						justify='center'
						boxSize={7}
						borderRadius={componentRadii.full}
						bg={componentColors.light.surface}
						flexShrink={0}
						_dark={{ bg: componentColors.dark.surface }}
					>
						<Icon
							as={CircleAlert}
							boxSize={4}
							color={componentColors.light.error}
							_dark={{ color: componentColors.dark.error }}
						/>
					</Flex>
					<Text
						fontSize='0.8125rem'
						lineHeight='1.25rem'
						color={componentColors.light.error}
						minH={7}
						display='flex'
						alignItems='center'
						_dark={{ color: componentColors.dark.error }}
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
