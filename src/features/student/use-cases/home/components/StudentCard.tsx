import { Surface, type SurfaceProps } from '@BaseComponents';
import { Flex, Heading, HStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type StudentCardProps = SurfaceProps & {
	flush?: boolean;
};

/** Shared visual frame for every card on the student dashboard. */
export function StudentCard({ flush = false, children, ...props }: StudentCardProps) {
	return (
		<Surface
			variant='panel'
			borderColor='border.surface'
			borderRadius='xl'
			boxShadow='surface'
			p={flush ? 0 : { base: 4, md: 5 }}
			overflow={flush ? 'hidden' : undefined}
			{...props}
		>
			{children}
		</Surface>
	);
}

type StudentCardHeaderProps = {
	icon?: ReactNode;
	title: ReactNode;
	action?: ReactNode;
};

export function StudentCardHeader({ icon, title, action }: StudentCardHeaderProps) {
	return (
		<Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4} minH='2.25rem'>
			<HStack gap={2} minW={0}>
				{icon}
				<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
					{title}
				</Heading>
			</HStack>
			{action}
		</Flex>
	);
}
