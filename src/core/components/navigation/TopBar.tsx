import { Surface } from '@BaseComponents';
import { Flex, Heading, HStack, IconButton, Text } from '@chakra-ui/react';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';

import { hoverSubtle } from '../../utils/interaction';

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
	const buttonMotion = hoverSubtle();
	return (
		<Surface variant='topBar' w='full' borderRadius={0}>
			<Flex align='center' justify='space-between' gap={3} wrap='nowrap'>
				<HStack gap={2} align='center' minW={0}>
					<Heading as='h1' textStyle='h6'>
						{title}
					</Heading>
					{subtitle ? (
						<Text textStyle='xs' color='textMuted' display={{ base: 'none', md: 'block' }}>
							{subtitle}
						</Text>
					) : null}
				</HStack>

				<HStack gap={2} ml='auto'>
					{rightContent}
					{onMenuClick ? (
						<IconButton
							aria-label='Abrir navegação'
							variant='outlinePurple'
							size='sm'
							display={{ base: 'inline-flex', xl: 'none' }}
							onClick={onMenuClick}
							color='textMuted'
							transition={buttonMotion.transition}
							_hover={buttonMotion.hover}
							_active={buttonMotion.active}
							_focusVisible={buttonMotion.focusVisible}
						>
							<Menu />
						</IconButton>
					) : null}
				</HStack>
			</Flex>
		</Surface>
	);
}
