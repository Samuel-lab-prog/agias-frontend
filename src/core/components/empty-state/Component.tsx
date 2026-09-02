import { Box, type BoxProps, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { componentColors, componentRadii } from '../localStyles';
import { stateCardSurfaceStyles } from '../state-card/surfaceStyles';

type EmptyStateCardProps = Omit<BoxProps, 'title'> & {
	role?: 'status' | 'alert';
	ariaLive?: 'polite' | 'assertive';
	eyebrow?: ReactNode;
	eyebrowIcon?: LucideIcon;
	eyebrowIconColor?: string;
	title: ReactNode;
	description: ReactNode;
	action?: ReactNode;
	actionAlign?: 'start' | 'end';
};

export function EmptyStateCard({
	role = 'status',
	ariaLive = 'polite',
	eyebrow,
	eyebrowIcon,
	eyebrowIconColor = componentColors.light.accent,
	title,
	description,
	action,
	actionAlign = 'start',
	children,
	...boxProps
}: EmptyStateCardProps) {
	return (
		<Box role={role} aria-live={ariaLive} w='full' {...stateCardSurfaceStyles} {...boxProps}>
			<VStack align='start' gap={4} position='relative' zIndex={1}>
				{eyebrow ? (
					<HStack
						px={3}
						py={2}
						borderRadius={componentRadii.full}
						bg='rgba(255, 255, 255, 0.06)'
						border='1px solid'
						borderColor='rgba(255, 255, 255, 0.08)'
						gap={2}
					>
						{eyebrowIcon ? <Icon as={eyebrowIcon} boxSize={4.5} color={eyebrowIconColor} /> : null}
						<Text
							fontSize='0.8125rem'
							lineHeight='1.25rem'
							color={componentColors.light.accent}
							letterSpacing='0.08em'
							textTransform='uppercase'
							_dark={{ color: componentColors.dark.accent }}
						>
							{eyebrow}
						</Text>
					</HStack>
				) : null}

				<VStack align='start' gap={2} w='full'>
					<Heading
						as='h2'
						fontSize='clamp(1.25rem, 2vw, 1.65rem)'
						lineHeight='1.2'
						fontWeight='700'
						color={componentColors.light.text}
						mb={0}
						_dark={{ color: componentColors.dark.text }}
					>
						{title}
					</Heading>
					<Text
						fontSize='0.8125rem'
						lineHeight='1.25rem'
						color={componentColors.light.textMuted}
						_dark={{ color: componentColors.dark.textMuted }}
					>
						{description}
					</Text>
				</VStack>

				{action ? (
					<Box w='full' display='flex' justifyContent={actionAlign === 'end' ? 'end' : 'start'}>
						{action}
					</Box>
				) : null}

				{children}
			</VStack>
		</Box>
	);
}
