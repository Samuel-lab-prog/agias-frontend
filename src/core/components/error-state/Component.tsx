import { Box, type BoxProps, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { BaseButton } from '../Button';
import { componentColors } from '../localStyles';
import { stateCardSurfaceStyles } from '../state-card/surfaceStyles';

type ErrorStateCardProps = Omit<BoxProps, 'title'> & {
	eyebrow?: ReactNode;
	title: ReactNode;
	description: ReactNode;
	action?: ReactNode;
	actionAlign?: 'start' | 'end';
	actionLabel?: ReactNode;
	onAction?: () => void;
};

export function ErrorStateCard({
	eyebrow = 'SOMETHING WENT WRONG',
	title,
	description,
	action,
	actionAlign = 'start',
	actionLabel = 'Try again',
	onAction,
	...boxProps
}: ErrorStateCardProps) {
	const renderedAction =
		action ??
		(onAction ? (
			<BaseButton size='sm' variant='solidPink' onClick={onAction}>
				{actionLabel}
			</BaseButton>
		) : null);

	return (
		<Box role='alert' w='full' {...stateCardSurfaceStyles} {...boxProps}>
			<VStack align='start' gap={3} position='relative' zIndex={1}>
				<Text
					fontSize='sm'
					fontWeight='bold'
					color={componentColors.light.accent}
					letterSpacing='0.06em'
					_dark={{ color: componentColors.dark.accent }}
				>
					{eyebrow}
				</Text>
				<Text
					fontSize={{ base: 'lg', md: 'xl' }}
					fontWeight='semibold'
					color={componentColors.light.text}
					_dark={{ color: componentColors.dark.text }}
				>
					{title}
				</Text>
				<Text
					fontSize='0.875rem'
					lineHeight='1.4rem'
					color={componentColors.light.textMuted}
					_dark={{ color: componentColors.dark.textMuted }}
				>
					{description}
				</Text>
				{renderedAction ? (
					<Box w='full' display='flex' justifyContent={actionAlign === 'end' ? 'end' : 'start'}>
						{renderedAction}
					</Box>
				) : null}
			</VStack>
		</Box>
	);
}
