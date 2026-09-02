import { Button as ChakraButton, type ButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { hoverLift, hoverSubtle } from '../utils/interaction';
import { componentColors, componentRadii } from './localStyles';

export type BaseButtonProps = ButtonProps & {
	loading?: boolean;
	fullWidth?: boolean;
};

const liftMotion = hoverLift();
const subtleMotion = hoverSubtle();

const localButtonVariants = {
	surface: {
		color: '#ffffff',
		borderColor: '#172554',
		background: 'linear-gradient(135deg, #172554, #1e40af)',
		boxShadow: '0 4px 14px rgba(3, 105, 161, 0.22)',
		_hover: {
			...liftMotion.hover,
			background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
			boxShadow: '0 8px 24px rgba(37, 99, 235, 0.28)',
		},
		_active: {
			...liftMotion.active,
			background: 'linear-gradient(135deg, #172554, #1e3a8a)',
			boxShadow: '0 2px 10px rgba(37, 99, 235, 0.32)',
		},
	},
	solidPurple: {
		bg: componentColors.light.accent,
		color: '#ffffff',
		borderColor: componentColors.light.accent,
		boxShadow: '0 4px 14px rgba(37, 99, 235, 0.24)',
		_hover: {
			...liftMotion.hover,
			bg: '#1d4ed8',
			boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
		},
		_active: {
			...liftMotion.active,
			bg: '#1e40af',
			boxShadow: '0 2px 10px rgba(37, 99, 235, 0.34)',
		},
	},
	solidPink: {
		bg: componentColors.light.error,
		color: '#ffffff',
		borderColor: componentColors.light.error,
		boxShadow: '0 4px 14px rgba(225, 29, 72, 0.22)',
		_hover: {
			...liftMotion.hover,
			bg: '#f43f5e',
			boxShadow: '0 8px 20px rgba(225, 29, 72, 0.28)',
		},
		_active: {
			...liftMotion.active,
			bg: '#be123c',
			boxShadow: '0 2px 10px rgba(225, 29, 72, 0.32)',
		},
	},
	outlinePurple: {
		bg: 'transparent',
		color: componentColors.light.text,
		borderColor: componentColors.light.border,
		_disabled: {
			color: componentColors.light.textMuted,
			borderColor: componentColors.light.border,
			bg: 'transparent',
		},
		_hover: {
			...subtleMotion.hover,
			bg: componentColors.light.surface,
			color: componentColors.light.text,
			borderColor: componentColors.light.borderHover,
		},
		_active: {
			...subtleMotion.active,
			bg: componentColors.light.surface,
		},
		_dark: {
			color: componentColors.dark.text,
			borderColor: componentColors.dark.border,
			_disabled: {
				color: componentColors.dark.textMuted,
				borderColor: componentColors.dark.border,
				bg: 'transparent',
			},
			_hover: {
				bg: componentColors.dark.surface,
				color: componentColors.dark.text,
				borderColor: componentColors.dark.borderHover,
			},
			_active: {
				bg: componentColors.dark.surface,
			},
		},
	},
	ghostPink: {
		bg: 'transparent',
		color: componentColors.light.text,
		borderColor: 'transparent',
		_disabled: {
			color: componentColors.light.textMuted,
			bg: 'transparent',
			borderColor: 'transparent',
		},
		_hover: {
			...subtleMotion.hover,
			bg: componentColors.light.surface,
			color: componentColors.light.text,
			borderColor: componentColors.light.border,
		},
		_active: {
			...subtleMotion.active,
			bg: componentColors.light.surface,
		},
		_dark: {
			color: componentColors.dark.text,
			_disabled: {
				color: componentColors.dark.textMuted,
				bg: 'transparent',
				borderColor: 'transparent',
			},
			_hover: {
				bg: componentColors.dark.surface,
				color: componentColors.dark.text,
				borderColor: componentColors.dark.border,
			},
			_active: {
				bg: componentColors.dark.surface,
			},
		},
	},
	danger: {
		bg: '#ef4444',
		color: '#ffffff',
		borderColor: '#ef4444',
		boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
		_hover: {
			...liftMotion.hover,
			bg: '#f87171',
			boxShadow: '0 8px 20px rgba(239, 68, 68, 0.32)',
		},
		_active: {
			...liftMotion.active,
			bg: '#ef4444',
			filter: 'brightness(0.92)',
			boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
		},
	},
} as const;

type LocalButtonVariant = keyof typeof localButtonVariants;

const isLocalButtonVariant = (variant: ButtonProps['variant']): variant is LocalButtonVariant =>
	typeof variant === 'string' && variant in localButtonVariants;

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
	({ loading, fullWidth, w, variant = 'surface', ...props }, ref) => {
		const localStyles = isLocalButtonVariant(variant) ? localButtonVariants[variant] : undefined;
		const chakraVariant = localStyles ? undefined : variant;

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
				borderRadius={componentRadii.md}
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
				{...localStyles}
				{...props}
			/>
		);
	},
);

BaseButton.displayName = 'BaseButton';
