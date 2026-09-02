import { Badge, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import { componentColors, componentRadii } from '../localStyles';

export function FooterBrand() {
	return (
		<VStack align='start' gap={3}>
			<HStack gap={3}>
				<Box
					w='44px'
					h='44px'
					display='grid'
					placeItems='center'
					borderRadius={componentRadii.full}
					bg='linear-gradient(135deg, #0f172a, #475569)'
					color={componentColors.dark.text}
					fontWeight='700'
					fontSize='sm'
				>
					OP
				</Box>
				<VStack align='start' gap={0}>
					<Heading
						as='h3'
						fontSize='clamp(1.25rem, 2vw, 1.65rem)'
						lineHeight='1.2'
						fontWeight='700'
						color={componentColors.light.text}
						_dark={{ color: componentColors.dark.text }}
					>
						HelloPoetry
					</Heading>
					<Badge
						size='sm'
						bg='rgba(148, 163, 184, 0.16)'
						color={componentColors.light.textMuted}
						_dark={{ color: componentColors.dark.textMuted }}
					>
						Poetry Platform
					</Badge>
				</VStack>
			</HStack>

			<Text
				fontSize='0.8125rem'
				lineHeight='1.25rem'
				color={componentColors.light.textMuted}
				maxW='sm'
				_dark={{ color: componentColors.dark.textMuted }}
			>
				Publish poems, save favorites, comment, and build connections with other authors.
			</Text>
		</VStack>
	);
}
