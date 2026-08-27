import { Flex, type FlexProps } from '@chakra-ui/react';

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
			transition='background-color 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease'
			_hover={{
				borderColor: 'borderHover',
				bg: 'surface',
			}}
			_focusWithin={{
				borderColor: 'borderHover',
				bg: 'surface',
				boxShadow: '0 10px 28px {colors.shadow}',
			}}
			animationName='fade-in'
			animationDuration='420ms'
			animationTimingFunction='ease-out'
			{...props}
		/>
	);
}
