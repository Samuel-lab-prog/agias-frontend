'use client';

import {
	createToaster,
	Portal,
	Spinner,
	Stack,
	Toast,
	Toaster as ChakraToaster,
} from '@chakra-ui/react';

import { componentColors } from '../localStyles';

// eslint-disable-next-line react-refresh/only-export-components
export const toaster = createToaster({
	placement: 'bottom-end',
	pauseOnPageIdle: true,
});

export const Toaster = () => (
	<Portal>
		<ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
			{(toast) => {
				const colorPalette = (toast.meta as { colorPalette?: string } | undefined)?.colorPalette;
				const tone =
					colorPalette === 'red' || colorPalette === 'pink'
						? {
								bg: componentColors.light.error,
								borderColor: componentColors.light.error,
								color: '#ffffff',
							}
						: colorPalette
							? {
									bg: componentColors.light.accent,
									borderColor: componentColors.light.accentStrong,
									color: '#ffffff',
								}
							: undefined;
				return (
					<Toast.Root
						width={{ md: 'sm' }}
						bg={tone?.bg}
						borderColor={tone?.borderColor}
						color={tone?.color}
					>
						{toast.type === 'loading' ? (
							<Spinner size='sm' color={componentColors.light.text} />
						) : (
							<Toast.Indicator />
						)}
						<Stack gap='1' flex='1' maxWidth='100%'>
							{toast.title && <Toast.Title>{toast.title}</Toast.Title>}
							{toast.description && <Toast.Description>{toast.description}</Toast.Description>}
						</Stack>
						{toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
						{toast.closable && <Toast.CloseTrigger />}
					</Toast.Root>
				);
			}}
		</ChakraToaster>
	</Portal>
);
