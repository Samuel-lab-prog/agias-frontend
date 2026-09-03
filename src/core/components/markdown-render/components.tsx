import { Box, Heading, Link, Mark, Text } from '@chakra-ui/react';
import { type Components } from 'react-markdown';

/**
 * Chakra-flavored renderers for common Markdown nodes.
 * These keep typography consistent with the design system.
 */
export const components: Components = {
	h1: ({ children }) => (
		<Heading
			as='h1'
			fontSize='clamp(2.25rem, 5vw, 4.5rem)'
			lineHeight='1.02'
			fontWeight='800'
			mt={8}
			mb={4}
		>
			{children}
		</Heading>
	),
	h2: ({ children }) => (
		<Heading
			as='h2'
			fontSize='clamp(1.8rem, 3.5vw, 3rem)'
			lineHeight='1.08'
			fontWeight='800'
			mt={7}
			mb={3}
		>
			{children}
		</Heading>
	),
	h3: ({ children }) => (
		<Heading
			as='h3'
			fontSize='clamp(1.5rem, 2.6vw, 2.25rem)'
			lineHeight='1.14'
			fontWeight='700'
			mt={6}
			mb={3}
		>
			{children}
		</Heading>
	),
	h4: ({ children }) => (
		<Heading
			as='h4'
			fontSize='clamp(1.25rem, 2vw, 1.65rem)'
			lineHeight='1.2'
			fontWeight='700'
			mt={5}
			mb={2}
		>
			{children}
		</Heading>
	),
	h5: ({ children }) => (
		<Heading
			as='h5'
			fontSize='clamp(1.1rem, 1.6vw, 1.35rem)'
			lineHeight='1.25'
			fontWeight='700'
			mt={4}
			mb={2}
		>
			{children}
		</Heading>
	),
	h6: ({ children }) => (
		<Heading as='h6' fontSize='1rem' lineHeight='1.3' fontWeight='700' mt={4} mb={2}>
			{children}
		</Heading>
	),

	p: ({ children }) => (
		<Text as='p' fontSize='1rem' lineHeight='1.7rem' my={3}>
			{children}
		</Text>
	),

	strong: ({ children }) => (
		<Text
			as='strong'
			fontWeight='700'
			display='inline'
			color='action.primary'
			_dark={{ color: 'action.primary' }}
		>
			{children}
		</Text>
	),
	em: ({ children }) => (
		<Text as='em' fontStyle='italic' display='inline'>
			{children}
		</Text>
	),

	mark: ({ children }) => (
		<Mark as='mark' bg='action.primarySubtle' color='fg.default' fontSize='1rem' lineHeight='1.7rem'>
			{children}
		</Mark>
	),

	ul: ({ children }) => (
		<Box as='ul' fontSize='1rem' lineHeight='1.7rem' pl={6} my={3}>
			{children}
		</Box>
	),
	ol: ({ children }) => (
		<Box as='ol' fontSize='1rem' lineHeight='1.7rem' pl={6} my={3}>
			{children}
		</Box>
	),
	li: ({ children }) => (
		<Box as='li' mb={1.5}>
			{children}
		</Box>
	),

	a: ({ children, href }) => (
		<Link
			href={href}
			color='fg.muted'
			textUnderlineOffset='3px'
			_hover={{
				color: 'fg.default',
				textDecoration: 'underline',
			}}
			_active={{ color: 'fg.default' }}
			_dark={{
				color: 'fg.muted',
				_hover: { color: 'fg.default' },
				_active: { color: 'fg.default' },
			}}
		>
			{children}
		</Link>
	),
	pre: ({ children }) => (
		<Box
			as='pre'
			my={4}
			px={4}
			py={3}
			borderRadius='md'
			bg='bg.muted'
			border='1px solid'
			borderColor='border.default'
			overflowX='auto'
		>
			{children}
		</Box>
	),
	code: ({ children, className }) => {
		const isBlock = className?.includes('language-');
		if (isBlock) {
			return (
				<Box
					as='code'
					fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
					fontSize='0.875rem'
					lineHeight='1.5rem'
					whiteSpace='pre'
				>
					{children}
				</Box>
			);
		}

		return (
			<Box
				as='code'
				fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
				fontSize='0.875rem'
				lineHeight='1.5rem'
				px={1.5}
				py={0.5}
				borderRadius='sm'
				bg='bg.interactive'
				color='fg.muted'
				_dark={{ color: 'fg.muted' }}
			>
				{children}
			</Box>
		);
	},
	blockquote: ({ children }) => (
		<Box
			as='blockquote'
			my={4}
			pl={4}
			py={1}
			borderLeft='3px solid'
			borderColor='border.interactive'
			bg='bg.muted'
			borderRadius='sm'
			fontSize='1rem'
			lineHeight='1.7rem'
			fontStyle='italic'
		>
			{children}
		</Box>
	),
	hr: () => <Box as='hr' my={6} borderColor='border.default' />,
};
