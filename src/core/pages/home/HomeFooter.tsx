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
				borderColor='border'
				direction={{ base: 'column', md: 'row' }}
			>
				<Text textStyle='xs' color='textMuted'>
					AGIAS | Diretoria de Tecnologia da Informação
				</Text>
				<Flex gap={4} wrap='wrap' justify='center'>
					{links.map((link) => (
						<Text key={link.label} textStyle='xs' color='textMuted'>
							{link.label}
						</Text>
					))}
				</Flex>
			</Flex>
		</Box>
	);
}
