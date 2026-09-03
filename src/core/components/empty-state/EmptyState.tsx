import { Box, type BoxProps, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

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
	eyebrowIconColor = 'action.primary',
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
						borderRadius={'full'}
						bg='bg.muted'
						border='1px solid'
						borderColor='bg.interactive'
						gap={2}
					>
						{eyebrowIcon ? <Icon as={eyebrowIcon} boxSize={4.5} color={eyebrowIconColor} /> : null}
						<Text
							fontSize='0.8125rem'
							lineHeight='1.25rem'
							color={'action.primary'}
							letterSpacing='0.08em'
							textTransform='uppercase'
							_dark={{ color: 'action.primary' }}
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
						color={'fg.default'}
						mb={0}
						_dark={{ color: 'fg.default' }}
					>
						{title}
					</Heading>
					<Text
						fontSize='0.8125rem'
						lineHeight='1.25rem'
						color={'fg.muted'}
						_dark={{ color: 'fg.muted' }}
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
