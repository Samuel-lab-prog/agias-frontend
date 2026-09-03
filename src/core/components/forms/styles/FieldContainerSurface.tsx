import { Box, type BoxProps } from '@chakra-ui/react';

import { hoverSubtle } from '../../../utils/interaction';

const subtleMotion = hoverSubtle();

interface FieldContainerProps extends BoxProps {
	delay?: number;
	hasError?: boolean;
}

export function FieldContainer({
	children,
	delay = 0,
	hasError = false,
	...props
}: FieldContainerProps) {
	return (
		<Box
			w='full'
			p='0.25rem'
			border='1px solid'
			borderColor={hasError ? 'status.error' : 'transparent'}
			bg={hasError ? 'bg.surface' : 'transparent'}
			borderRadius='md'
			transition={subtleMotion.transition}
			_focusWithin={{
				...subtleMotion.focusVisible,
				borderColor: hasError ? 'status.error' : 'border.interactive',
				bg: 'bg.surface',
			}}
			_dark={{
				borderColor: hasError ? 'status.error' : 'transparent',
				bg: hasError ? 'bg.surface' : 'transparent',
				_focusWithin: {
					borderColor: hasError ? 'status.error' : 'border.interactive',
					bg: 'bg.surface',
				},
			}}
			animationName='slide-from-bottom, fade-in'
			animationDuration='380ms'
			animationTimingFunction='ease-out'
			animationFillMode='backwards'
			animationDelay={`${delay}ms`}
			{...props}
		>
			{children}
		</Box>
	);
}
