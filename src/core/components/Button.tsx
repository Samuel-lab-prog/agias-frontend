import { Button as ChakraButton, type ButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { hoverLift, hoverSubtle } from '../utils/interaction';

export type BaseButtonVariant =
	| 'primary'
	| 'secondary'
	| 'subtle'
	| 'destructive'
	| ButtonProps['variant'];

export type BaseButtonProps = Omit<ButtonProps, 'variant'> & {
	variant?: BaseButtonVariant;
	loading?: boolean;
	fullWidth?: boolean;
};

const liftMotion = hoverLift();
const subtleMotion = hoverSubtle();

const localButtonVariants = {
	primary: {
		color: 'fg.inverted',
		borderColor: 'action.primary',
		bg: 'action.primary',
		boxShadow: 'floating',
		_hover: {
			...liftMotion.hover,
			bg: 'action.primaryStrong',
			boxShadow: 'floating',
		},
		_active: {
			...liftMotion.active,
			bg: 'action.primary',
			boxShadow: 'surface',
		},
	},
	secondary: {
		bg: 'transparent',
		color: 'fg.default',
		borderColor: 'border.default',
		_disabled: {
			color: 'fg.muted',
			borderColor: 'border.default',
			bg: 'transparent',
		},
		_hover: {
			...subtleMotion.hover,
			bg: 'bg.surface',
			color: 'fg.default',
			borderColor: 'border.interactive',
		},
		_active: {
			...subtleMotion.active,
			bg: 'bg.surface',
		},
		_dark: {
			color: 'fg.default',
			borderColor: 'border.default',
			_disabled: {
				color: 'fg.muted',
				borderColor: 'border.default',
				bg: 'transparent',
			},
			_hover: {
				bg: 'bg.surface',
				color: 'fg.default',
				borderColor: 'border.interactive',
			},
			_active: {
				bg: 'bg.surface',
			},
		},
	},
	subtle: {
		bg: 'transparent',
		color: 'fg.default',
		borderColor: 'transparent',
		_disabled: {
			color: 'fg.muted',
			bg: 'transparent',
			borderColor: 'transparent',
		},
		_hover: {
			...subtleMotion.hover,
			bg: 'bg.surface',
			color: 'fg.default',
			borderColor: 'border.default',
		},
		_active: {
			...subtleMotion.active,
			bg: 'bg.surface',
		},
		_dark: {
			color: 'fg.default',
			_disabled: {
				color: 'fg.muted',
				bg: 'transparent',
				borderColor: 'transparent',
			},
			_hover: {
				bg: 'bg.surface',
				color: 'fg.default',
				borderColor: 'border.default',
			},
			_active: {
				bg: 'bg.surface',
			},
		},
	},
	destructive: {
		bg: 'action.destructive',
		color: 'fg.inverted',
		borderColor: 'action.destructive',
		boxShadow: 'floating',
		_hover: {
			...liftMotion.hover,
			filter: 'brightness(1.08)',
			boxShadow: 'floating',
		},
		_active: {
			...liftMotion.active,
			bg: 'action.destructive',
			filter: 'brightness(0.92)',
			boxShadow: 'surface',
		},
	},
} as const;

type LocalButtonVariant = keyof typeof localButtonVariants;

const isLocalButtonVariant = (variant: unknown): variant is LocalButtonVariant =>
	typeof variant === 'string' && variant in localButtonVariants;

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
	({ loading, fullWidth, w, variant = 'primary', ...props }, ref) => {
		const variantStyles = isLocalButtonVariant(variant) ? localButtonVariants[variant] : undefined;
		const chakraVariant = variantStyles ? undefined : (variant as ButtonProps['variant']);

		return (
			<ChakraButton
				ref={ref}
				loading={loading}
				w={fullWidth ? 'full' : w}
				display='inline-flex'
				alignItems='center'
				justifyContent='center'
				gap='0.5rem'
				fontWeight='semibold'
				borderRadius='md'
				border='1px solid transparent'
				userSelect='none'
				transform='translateY(0)'
				willChange='transform, box-shadow, filter'
				transition={liftMotion.transition}
				_focusVisible={liftMotion.focusVisible}
				_disabled={{
					...liftMotion.disabled,
					opacity: '0.78',
					cursor: 'not-allowed',
					boxShadow: 'none',
					filter: 'saturate(0.92)',
				}}
				variant={chakraVariant}
				{...variantStyles}
				{...props}
			/>
		);
	},
);

BaseButton.displayName = 'BaseButton';
