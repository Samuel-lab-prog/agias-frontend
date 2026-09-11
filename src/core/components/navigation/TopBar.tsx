import { Surface } from '@BaseComponents';
import { Flex, Heading, HStack, IconButton, Text } from '@chakra-ui/react';
import { Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { foundations } from '../../themes/foundations';
import { hoverSubtle } from '../../utils/interaction';

type NavigationTopBarProps = {
	title?: string;
	subtitle?: string;
	onMenuClick?: () => void;
	menuOpen?: boolean;
	rightContent?: ReactNode;
};

export function NavigationTopBar({
	title = 'AGIAS',
	subtitle,
	onMenuClick,
	menuOpen = false,
	rightContent,
}: NavigationTopBarProps) {
	const buttonMotion = hoverSubtle();
	return (
		<Surface
			variant='topBar'
			w='full'
			borderRadius={0}
			h={foundations.sizes.topBar}
			minH={foundations.sizes.topBar}
			py={0}
			display='flex'
			flexDirection='column'
			justifyContent='center'
		>
			<Flex align='center' justify='space-between' gap={3} wrap='nowrap'>
				<HStack gap={2} align='center' minW={0}>
					<Heading as='p' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
						{title}
					</Heading>
					{subtitle ? (
						<Text
							fontSize='0.75rem'
							lineHeight='1rem'
							color='fg.muted'
							display={{ base: 'none', md: 'block' }}
							_dark={{ color: 'fg.muted' }}
						>
							{subtitle}
						</Text>
					) : null}
				</HStack>

				<HStack gap={2} ml='auto'>
					{rightContent}
					{onMenuClick ? (
						<IconButton
							id='navigation-toggle'
							aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'}
							aria-expanded={menuOpen}
							aria-controls='mobile-navigation'
							minH='44px'
							minW='44px'
							variant='outline'
							size='sm'
							display={{ base: 'inline-flex', xl: 'none' }}
							onClick={onMenuClick}
							color='fg.muted'
							borderColor='border.default'
							transition={buttonMotion.transition}
							_hover={{
								...buttonMotion.hover,
								borderColor: 'border.interactive',
								color: 'fg.default',
							}}
							_active={buttonMotion.active}
							_focusVisible={buttonMotion.focusVisible}
							_dark={{
								color: 'fg.muted',
								borderColor: 'border.default',
								_hover: {
									borderColor: 'border.interactive',
									color: 'fg.default',
								},
							}}
						>
							{menuOpen ? <X /> : <Menu />}
						</IconButton>
					) : null}
				</HStack>
			</Flex>
		</Surface>
	);
}
