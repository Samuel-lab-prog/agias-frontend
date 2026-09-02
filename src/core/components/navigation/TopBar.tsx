import { Surface } from '@BaseComponents';
import { Flex, Heading, HStack, IconButton, Text } from '@chakra-ui/react';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';

import { hoverSubtle } from '../../utils/interaction';
import { componentColors } from '../localStyles';

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
					<Heading as='h1' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
						{title}
					</Heading>
					{subtitle ? (
						<Text
							fontSize='0.75rem'
							lineHeight='1rem'
							color={componentColors.light.textMuted}
							display={{ base: 'none', md: 'block' }}
							_dark={{ color: componentColors.dark.textMuted }}
						>
							{subtitle}
						</Text>
					) : null}
				</HStack>

				<HStack gap={2} ml='auto'>
					{rightContent}
					{onMenuClick ? (
						<IconButton
							aria-label='Abrir navegação'
							variant='outline'
							size='sm'
							display={{ base: 'inline-flex', xl: 'none' }}
							onClick={onMenuClick}
							color={componentColors.light.textMuted}
							borderColor={componentColors.light.border}
							transition={buttonMotion.transition}
							_hover={{
								...buttonMotion.hover,
								borderColor: componentColors.light.borderHover,
								color: componentColors.light.text,
							}}
							_active={buttonMotion.active}
							_focusVisible={buttonMotion.focusVisible}
							_dark={{
								color: componentColors.dark.textMuted,
								borderColor: componentColors.dark.border,
								_hover: {
									borderColor: componentColors.dark.borderHover,
									color: componentColors.dark.text,
								},
							}}
						>
							<Menu />
						</IconButton>
					) : null}
				</HStack>
			</Flex>
		</Surface>
	);
}
