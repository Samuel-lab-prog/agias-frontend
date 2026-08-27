import { Flex, type FlexProps } from '@chakra-ui/react';

import { hoverLift } from '../../../utils/interaction';

const liftMotion = hoverLift();

export function FormCard(props: FlexProps) {
	return (
		<Flex
			direction='column'
			align='center'
			gap={1}
			p={2}
			w='full'
			maxW='md'
			border='1px solid'
			borderColor='border'
			borderRadius='xl'
			bg='surface'
			backdropFilter='blur(4px)'
			transition={liftMotion.transition}
			_hover={{
				...liftMotion.hover,
				borderColor: 'borderHover',
				bg: 'surface',
			}}
			_focusWithin={{
				...liftMotion.focusVisible,
				borderColor: 'borderHover',
				bg: 'surface',
				boxShadow: '0 10px 28px {colors.surfaceShadow}',
			}}
			animationName='fade-in'
			animationDuration='420ms'
			animationTimingFunction='ease-out'
			{...props}
		/>
	);
}
