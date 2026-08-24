import { Surface } from '@BaseComponents';
import { Flex, Heading, HStack, IconButton, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';

type NavigationTopBarProps = {
	title?: string;
	subtitle?: string;
	onMenuClick?: () => void;
	rightContent?: ReactNode;
};

export function NavigationTopBar({
	title = 'AGIAS',
	subtitle,
	onMenuClick,
	rightContent,
}: NavigationTopBarProps) {
	return (
		<Surface
			variant='panel'
			px={{ base: 3, md: 4, xl: 6 }}
			py={{ base: 3, md: 4 }}
			w='full'
			borderRadius={0}
		>
			<Flex align='center' justify='space-between' gap={3} wrap='nowrap'>
				<HStack gap={2} align='center' minW={0}>
					<Heading as='h1' textStyle='h6'>
						{title}
					</Heading>
					{subtitle ? (
						<Text textStyle='xs' color='pink.200' display={{ base: 'none', md: 'block' }}>
							{subtitle}
						</Text>
					) : null}
				</HStack>

				<HStack gap={2} ml='auto'>
					{rightContent}
					{onMenuClick ? (
						<IconButton
							aria-label='Abrir navegação'
							variant='ghost'
							size='sm'
							display={{ base: 'inline-flex', xl: 'none' }}
							onClick={onMenuClick}
							color='pink.100'
							_hover={{ bg: 'rgba(255,255,255,0.05)', color: 'pink.50' }}
						>
							<Menu />
						</IconButton>
					) : null}
				</HStack>
			</Flex>
		</Surface>
	);
}
