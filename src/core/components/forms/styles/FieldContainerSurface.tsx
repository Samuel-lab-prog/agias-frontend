import { Box, type BoxProps } from '@chakra-ui/react';

import { hoverSubtle } from '../../../utils/interaction';
import { componentColors, componentRadii } from '../../localStyles';

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
			borderColor={hasError ? componentColors.light.error : 'transparent'}
			bg={hasError ? componentColors.light.surface : 'transparent'}
			borderRadius={componentRadii.md}
			transition={subtleMotion.transition}
			_focusWithin={{
				...subtleMotion.focusVisible,
				borderColor: hasError ? componentColors.light.error : componentColors.light.borderHover,
				bg: componentColors.light.surface,
			}}
			_dark={{
				borderColor: hasError ? componentColors.dark.error : 'transparent',
				bg: hasError ? componentColors.dark.surface : 'transparent',
				_focusWithin: {
					borderColor: hasError ? componentColors.dark.error : componentColors.dark.borderHover,
					bg: componentColors.dark.surface,
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
