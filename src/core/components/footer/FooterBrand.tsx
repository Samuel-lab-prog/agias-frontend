import { Badge, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';

export function FooterBrand() {
	return (
		<VStack align='start' gap={3}>
			<HStack gap={3}>
				<Box
					w='44px'
					h='44px'
					display='grid'
					placeItems='center'
					borderRadius='full'
					bg='action.primaryStrong'
					color='fg.default'
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
						color='fg.default'
						_dark={{ color: 'fg.default' }}
					>
						HelloPoetry
					</Heading>
					<Badge size='sm' bg='border.muted' color='fg.muted' _dark={{ color: 'fg.muted' }}>
						Poetry Platform
					</Badge>
				</VStack>
			</HStack>

			<Text
				fontSize='0.8125rem'
				lineHeight='1.25rem'
				color='fg.muted'
				maxW='sm'
				_dark={{ color: 'fg.muted' }}
			>
				Publish poems, save favorites, comment, and build connections with other authors.
			</Text>
		</VStack>
	);
}
