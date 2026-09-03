import { Flex, type FlexProps, Heading, Stack, type StackProps, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export function PageRoot(props: FlexProps) {
	return (
		<Flex as='main' minH='100dvh' bg='bg.canvas' color='fg.default' direction='column' {...props} />
	);
}

type SectionHeaderProps = StackProps & { title: string; description?: string; action?: ReactNode };

export function SectionHeader({ title, description, action, ...props }: SectionHeaderProps) {
	return (
		<Stack gap={1.5} {...props}>
			<Flex align='start' justify='space-between' gap={4}>
				<Stack gap={1}>
					<Heading size={{ base: 'sm', md: 'md' }}>{title}</Heading>
					{description ? <Text color='fg.muted'>{description}</Text> : null}
				</Stack>
				{action}
			</Flex>
		</Stack>
	);
}
