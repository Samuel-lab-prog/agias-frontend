import { Flex, type FlexProps } from '@chakra-ui/react';

import { hoverLift } from '../../../utils/interaction';
import { componentColors, componentRadii } from '../../localStyles';

const liftMotion = hoverLift();

export function FormCard(props: FlexProps) {
	return (
		<Flex
			direction='column'
			align='center'
			gap={1}
			p='0.5rem'
			w='full'
			maxW='md'
			border='1px solid'
			borderColor={componentColors.light.border}
			borderRadius={componentRadii.xl}
			bg={componentColors.light.surface}
			backdropFilter='blur(4px)'
			transition={liftMotion.transition}
			_hover={{
				...liftMotion.hover,
				borderColor: componentColors.light.borderHover,
				bg: componentColors.light.surface,
			}}
			_focusWithin={{
				...liftMotion.focusVisible,
				borderColor: componentColors.light.borderHover,
				bg: componentColors.light.surface,
				boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)',
			}}
			_dark={{
				borderColor: componentColors.dark.border,
				bg: componentColors.dark.surface,
				_hover: {
					borderColor: componentColors.dark.borderHover,
					bg: componentColors.dark.surface,
				},
				_focusWithin: {
					borderColor: componentColors.dark.borderHover,
					bg: componentColors.dark.surface,
					boxShadow: '0 10px 28px rgba(0, 0, 0, 0.34)',
				},
			}}
			animationName='fade-in'
			animationDuration='420ms'
			animationTimingFunction='ease-out'
			{...props}
		/>
	);
}
