import { Box, type BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { interactiveStyles } from '../../themes/motion';
import { surfaceVariants } from './variants';

export type SurfaceVariant = keyof typeof surfaceVariants;

export interface SurfaceProps extends Omit<BoxProps, 'color'> {
	variant?: SurfaceVariant;
	interactive?: boolean;
	color?: BoxProps['bg'];
	borderColor?: BoxProps['borderColor'];
}

/**
 * A styled container that applies a consistent surface variant.
 */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
	{ variant = 'soft', interactive = false, color, bg, borderColor, ...props },
	ref,
) {
	const variantStyles = surfaceVariants[variant];
	const resolvedBg = color ?? bg ?? variantStyles.bg;
	const resolvedBorderColor = borderColor ?? variantStyles.borderColor;

	return (
		<Box
			ref={ref}
			{...variantStyles}
			bg={resolvedBg}
			borderColor={resolvedBorderColor}
			{...(interactive ? interactiveStyles.card : {})}
			data-interactive={interactive ? 'card' : undefined}
			{...props}
		/>
	);
});
