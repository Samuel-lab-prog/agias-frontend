import { Flex, type FlexProps } from '@chakra-ui/react';

import { hoverLift } from '../../../utils/interaction';

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
			borderColor={'border.default'}
			borderRadius={'xl'}
			bg={'bg.surface'}
			backdropFilter='blur(4px)'
			transition={liftMotion.transition}
			_hover={{
				...liftMotion.hover,
				borderColor: 'border.interactive',
				bg: 'bg.surface',
			}}
			_focusWithin={{
				...liftMotion.focusVisible,
				borderColor: 'border.interactive',
				bg: 'bg.surface',
				boxShadow: 'floating',
			}}
			_dark={{
				borderColor: 'border.default',
				bg: 'bg.surface',
				_hover: {
					borderColor: 'border.interactive',
					bg: 'bg.surface',
				},
				_focusWithin: {
					borderColor: 'border.interactive',
					bg: 'bg.surface',
					boxShadow: 'floating',
				},
			}}
			animationName='fade-in'
			animationDuration='420ms'
			animationTimingFunction='ease-out'
			{...props}
		/>
	);
}
