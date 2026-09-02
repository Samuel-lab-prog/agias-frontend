import { Box, Heading, Link, Mark, Text } from '@chakra-ui/react';
import { type Components } from 'react-markdown';

import { componentColors, componentRadii } from '../localStyles';

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
			color={componentColors.light.accent}
			_dark={{ color: componentColors.dark.accent }}
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
		<Mark
			as='mark'
			bg={componentColors.light.accentSoft}
			color={componentColors.light.text}
			fontSize='1rem'
			lineHeight='1.7rem'
		>
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
			color={componentColors.light.textMuted}
			textUnderlineOffset='3px'
			_hover={{
				color: componentColors.light.text,
				textDecoration: 'underline',
			}}
			_active={{ color: componentColors.light.text }}
			_dark={{
				color: componentColors.dark.textMuted,
				_hover: { color: componentColors.dark.text },
				_active: { color: componentColors.dark.text },
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
			borderRadius={componentRadii.md}
			bg='rgba(255, 255, 255, 0.04)'
			border='1px solid'
			borderColor='rgba(148, 163, 184, 0.24)'
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
				borderRadius={componentRadii.sm}
				bg='rgba(255, 255, 255, 0.08)'
				color={componentColors.light.textMuted}
				_dark={{ color: componentColors.dark.textMuted }}
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
			borderColor={componentColors.light.borderHover}
			bg='rgba(255, 255, 255, 0.03)'
			borderRadius={componentRadii.sm}
			fontSize='1rem'
			lineHeight='1.7rem'
			fontStyle='italic'
		>
			{children}
		</Box>
	),
	hr: () => <Box as='hr' my={6} borderColor='rgba(148, 163, 184, 0.24)' />,
};
