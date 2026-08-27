import { Surface } from '@BaseComponents';
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';

import { DevSubNav } from '../../components/DevSubNav';

type SemanticToken = {
	name: string;
	light: string;
	dark: string;
	description: string;
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

export function DevColorsPage() {
	const semanticTokens: SemanticToken[] = [
		{
			name: 'background',
			light: '#ffffff',
			dark: '#020617',
			description: 'Fundo principal da página e áreas mais externas.',
		},
		{
			name: 'surface',
			light: '#fcfcfd',
			dark: '#0f172a',
			description: 'Cartões, painéis e superfícies elevadas com leve separação do fundo.',
		},
		{
			name: 'border',
			light: '#e2e8f0',
			dark: '#1e293b',
			description: 'Separadores, bordas padrão e contornos neutros.',
		},
		{
			name: 'borderHover',
			light: '#cbd5e1',
			dark: '#64748b',
			description: 'Borda em hover, foco sutil e realce de interação.',
		},
		{
			name: 'text',
			light: '#1f2a44',
			dark: '#f1f5f9',
			description: 'Texto principal de leitura e labels importantes.',
		},
		{
			name: 'textMuted',
			light: '#5f6b85',
			dark: '#cbd5e1',
			description: 'Texto secundário, legendas e detalhes de apoio.',
		},
		{
			name: 'accent',
			light: '#1d4ed8',
			dark: '#93c5fd',
			description: 'Links, ações principais e elementos de destaque.',
		},
		{
			name: 'accentSoft',
			light: '#dbeafe',
			dark: '#1e3a8a',
			description: 'Fundo suave para chips, callouts e destaques leves.',
		},
		{
			name: 'accentStrong',
			light: '#172554',
			dark: '#dbeafe',
			description: 'Versão forte do acento para contraste alto.',
		},
		{
			name: 'error',
			light: '#e11d48',
			dark: '#fb7185',
			description: 'Mensagens de erro, validação e estados destrutivos.',
		},
		{
			name: 'warning',
			light: '#d97706',
			dark: '#fbbf24',
			description: 'Avisos, atenção antes de uma ação e estados não críticos.',
		},
		{
			name: 'focusRing',
			light: '#60a5fa',
			dark: '#93c5fd',
			description: 'Anel de foco acessível para navegação por teclado.',
		},
	];

	return (
		<Flex as='main' layerStyle='mainPadded' direction='column' gap={8} pb={12}>
			<DevSubNav />
			<Stack gap={4}>
				<SectionTitle
					title='Tokens semânticos'
					description='Cada token abaixo aparece com uma amostra visual e uma descrição curta de uso.'
				/>
				<Surface variant='panel' p={0} borderRadius='2xl' overflow='hidden'>
					<Box
						p={4}
						borderBottom='1px solid'
						borderColor='border'
						display={{ base: 'none', md: 'block' }}
					>
						<Box
							display='grid'
							gridTemplateColumns='220px 1fr 1fr 1.2fr'
							gap={3}
							fontSize='sm'
							fontWeight='semibold'
							color='fg.muted'
						>
							<Text>Token</Text>
							<Text>Light</Text>
							<Text>Dark</Text>
							<Text>Uso</Text>
						</Box>
					</Box>
					<Box p={4} display='grid' gap={4}>
						{semanticTokens.map((token) => (
							<Box
								key={token.name}
								display={{ base: 'block', md: 'grid' }}
								gridTemplateColumns={{ md: '220px 1fr 1fr 1.2fr' }}
								gap={3}
								p={{ base: 4, md: 0 }}
								borderBottom='1px solid'
								borderColor='border'
								_last={{ borderBottom: 'none' }}
								borderRadius={{ base: 'xl', md: 'none' }}
								bg={{ base: 'rgba(255,255,255,0.6)', md: 'transparent' }}
							>
								<Stack gap={1} mb={{ base: 4, md: 0 }}>
									<Text fontWeight='semibold'>{token.name}</Text>
									<Text fontSize='xs' color='fg.muted'>
										{token.description}
									</Text>
								</Stack>
								<Stack gap={2} mb={{ base: 4, md: 0 }}>
									<Text
										fontSize='xs'
										fontWeight='semibold'
										color='fg.muted'
										display={{ md: 'none' }}
									>
										Light
									</Text>
									<Box
										h='28px'
										borderRadius='md'
										bg={token.light}
										border='1px solid'
										borderColor='border'
									/>
									<Text fontSize='sm' color='fg.muted'>
										{token.light}
									</Text>
								</Stack>
								<Stack gap={2} mb={{ base: 4, md: 0 }}>
									<Text
										fontSize='xs'
										fontWeight='semibold'
										color='fg.muted'
										display={{ md: 'none' }}
									>
										Dark
									</Text>
									<Box
										h='28px'
										borderRadius='md'
										bg={token.dark}
										border='1px solid'
										borderColor='border'
									/>
									<Text fontSize='sm' color='fg.muted'>
										{token.dark}
									</Text>
								</Stack>
								<Text fontSize='sm' color='fg.muted' display={{ base: 'none', md: 'block' }}>
									{token.description}
								</Text>
							</Box>
						))}
					</Box>
				</Surface>
			</Stack>
		</Flex>
	);
}
