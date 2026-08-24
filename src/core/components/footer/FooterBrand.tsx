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
					bg='linear-gradient(135deg, {colors.gray.900}, {colors.gray.600})'
					color='white'
					fontWeight='700'
					fontSize='sm'
				>
					OP
				</Box>
				<VStack align='start' gap={0}>
					<Heading as='h3' textStyle='h4' color='text'>
						HelloPoetry
					</Heading>
					<Badge size='sm' colorPalette='gray' variant='subtle'>
						Poetry Platform
					</Badge>
				</VStack>
			</HStack>

			<Text textStyle='smaller' color='textMuted' maxW='sm'>
				Publish poems, save favorites, comment, and build connections with other authors.
			</Text>
		</VStack>
	);
}
