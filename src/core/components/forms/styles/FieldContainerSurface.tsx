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
			p='1'
			border='1px solid'
			borderColor={hasError ? 'error' : 'transparent'}
			bg={hasError ? 'surface' : 'transparent'}
			borderRadius='md'
			transition={subtleMotion.transition}
			_focusWithin={{
				...subtleMotion.focusVisible,
				borderColor: hasError ? 'error' : 'borderHover',
				bg: hasError ? 'surface' : 'surface',
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
