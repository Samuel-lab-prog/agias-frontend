import { Surface } from '@BaseComponents';
import { Flex, HStack, Link, Text } from '@chakra-ui/react';
import type { NavigationLink } from '@core/components/navigation';
import { NavLink } from 'react-router-dom';

type HomeFooterProps = {
	links: NavigationLink[];
};

export function HomeFooter({ links }: HomeFooterProps) {
	return (
		<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
			<Flex direction='column' gap={3}>
				<HStack justify='space-between' wrap='wrap' gap={3}>
					<Text textStyle='smaller' color='textMuted'>
						AGIAS
					</Text>
					<HStack gap={4} wrap='wrap'>
						{links.map((link) => (
							<Link key={link.to} asChild color='textMuted' textStyle='smaller'>
								<NavLink to={link.to}>{link.label}</NavLink>
							</Link>
						))}
					</HStack>
				</HStack>
			</Flex>
		</Surface>
	);
}
