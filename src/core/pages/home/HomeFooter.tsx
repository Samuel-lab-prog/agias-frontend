import { Box, Flex, Text } from '@chakra-ui/react';

type FooterLink = { label: string; to: string };

type HomeFooterProps = {
	links: FooterLink[];
};

export function HomeFooter({ links }: HomeFooterProps) {
	return (
		<Box as='footer' pt={2}>
			<Flex
				align='center'
				justify='space-between'
				gap={3}
				px={3}
				py={2.5}
				borderTop='1px solid'
				borderColor='rgba(15, 23, 42, 0.08)'
				direction={{ base: 'column', md: 'row' }}
			>
				<Text fontSize='0.75rem' lineHeight='1rem' color='#475569'>
					AGIAS | Diretoria de Tecnologia da Informação
				</Text>
				<Flex gap={4} wrap='wrap' justify='center'>
					{links.map((link) => (
						<Text key={link.label} fontSize='0.75rem' lineHeight='1rem' color='#475569'>
							{link.label}
						</Text>
					))}
				</Flex>
			</Flex>
		</Box>
	);
}
