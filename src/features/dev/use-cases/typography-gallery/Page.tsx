import { Surface } from '@BaseComponents';
import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { typographyStyles } from '@themes/typography';

import { DevSubNav } from '../../components/DevSubNav';

type TypographyToken = {
	name: string;
	description: string;
	sample: string;
	previewStyle: keyof typeof typographyStyles;
	spec: string;
};

function SectionTitle({ title, description }: { title: string; description: string }) {
	return (
		<Stack gap={1}>
			<Heading size='md'>{title}</Heading>
			<Text color='fg.muted' maxW='2xl'>
				{description}
			</Text>
		</Stack>
	);
}

function TypographyCard({ token }: { token: TypographyToken }) {
	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }} borderRadius='2xl'>
			<Stack gap={3}>
				<Stack gap={1.5}>
					<Heading size='sm'>{token.name}</Heading>
					<Text fontSize='sm' color='fg.muted'>
						{token.description}
					</Text>
					<Text fontSize='xs' color='fg.muted'>
						{token.spec}
					</Text>
				</Stack>
				<Box
					p={{ base: 4, md: 5 }}
					borderRadius='xl'
					border='1px solid'
					borderColor='border.default'
					bg='bg.surface'
				>
					<Text
						{...typographyStyles[token.previewStyle]}
						color='fg.default'
						display='block'
						minH='3em'
					>
						{token.sample}
					</Text>
				</Box>
			</Stack>
		</Surface>
	);
}

export function DevTypographyPage() {
	const tokens: TypographyToken[] = [
		{
			name: 'body',
			description: 'Texto padrão de parágrafo e leitura geral.',
			sample: 'The quick brown fox jumps over the lazy dog.',
			previewStyle: 'body',
			spec: 'xs → md, 400, line-height tall → shorter',
		},
		{
			name: 'lead',
			description: 'Texto introdutório para subtítulos e destaque inicial.',
			sample: 'Uma linha de apoio mais forte para abrir a seção.',
			previewStyle: 'lead',
			spec: 'md → xl, 400, line-height tall → shorter',
		},
		{
			name: 'small',
			description: 'Texto menos proeminente para descrições e apoio.',
			sample: 'Texto secundário com menor presença visual.',
			previewStyle: 'small',
			spec: 'xs → sm, 400, line-height shorter',
		},
		{
			name: 'smaller',
			description: 'Legenda e fine print.',
			sample: 'Caption curta para contexto adicional.',
			previewStyle: 'smaller',
			spec: '2xs → xs, 400, letter-spacing 0.015em',
		},
		{
			name: 'h1',
			description: 'Título principal da página.',
			sample: 'Headline principal',
			previewStyle: 'h1',
			spec: '2xl → 5xl, 700, letter-spacing -0.02em',
		},
		{
			name: 'h2',
			description: 'Título de seção.',
			sample: 'Título de seção',
			previewStyle: 'h2',
			spec: 'xl → 3xl, 600, letter-spacing -0.015em',
		},
		{
			name: 'h3',
			description: 'Título de subseção.',
			sample: 'Título de subseção',
			previewStyle: 'h3',
			spec: 'lg → 2xl, 600, letter-spacing -0.01em',
		},
		{
			name: 'h4',
			description: 'Título de card ou bloco.',
			sample: 'Título de card',
			previewStyle: 'h4',
			spec: 'md → xl, 600, letter-spacing -0.005em',
		},
		{
			name: 'h5',
			description: 'Título menor.',
			sample: 'Título menor',
			previewStyle: 'h5',
			spec: 'xs → md, 600',
		},
		{
			name: 'h6',
			description: 'Eyebrow title em caixa alta.',
			sample: 'Compact heading',
			previewStyle: 'h6',
			spec: 'xs → md, 600, uppercase, letter-spacing 0.04em',
		},
		{
			name: 'label',
			description: 'Texto compacto em caixa alta para rótulos.',
			sample: 'section label',
			previewStyle: 'label',
			spec: '2xs → xs, 600, uppercase, letter-spacing 0.08em',
		},
		{
			name: 'code',
			description: 'Trechos técnicos e inline code.',
			sample: 'const token = "accent";',
			previewStyle: 'code',
			spec: 'xs → sm, monospace, 500',
		},
	];

	return (
		<Flex
			as='main'
			bg='bg.canvas'
			color='fg.default'
			minH='100dvh'
			px={{ base: 4, md: 6 }}
			py={{ base: 6, md: 10 }}
			direction='column'
			gap={8}
			pb={12}
		>
			<DevSubNav />
			<Stack gap={4}>
				<SectionTitle
					title='Tipografia'
					description='Correspondente à tipografia local usada pelos componentes. Cada card mostra uso, amostra e leitura real.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}>
					{tokens.map((token) => (
						<TypographyCard key={token.name} token={token} />
					))}
				</Grid>
			</Stack>
		</Flex>
	);
}
