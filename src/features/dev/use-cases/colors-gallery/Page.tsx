import { Surface } from '@BaseComponents';
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';

import { documentedColorTokens } from '../../../../core/themes/semanticTokens';
import { DevSubNav } from '../../components/DevSubNav';

type LocalColor = {
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
	const localColors: LocalColor[] = documentedColorTokens.map(([name, values, description]) => ({
		name,
		light: values.light,
		dark: values.dark,
		description,
	}));

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
					title='Tokens semânticos'
					description='Cada token abaixo aparece com uma amostra visual e uma descrição curta de uso.'
				/>
				<Surface variant='panel' p={0} borderRadius='2xl' overflow='hidden'>
					<Box
						p={4}
						borderBottom='1px solid'
						borderColor='border.default'
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
						{localColors.map((token) => (
							<Box
								key={token.name}
								display={{ base: 'block', md: 'grid' }}
								gridTemplateColumns={{ md: '220px 1fr 1fr 1.2fr' }}
								gap={3}
								p={{ base: 4, md: 0 }}
								borderBottom='1px solid'
								borderColor='border.default'
								_last={{ borderBottom: 'none' }}
								borderRadius={{ base: 'xl', md: 'none' }}
								bg={{ base: 'bg.muted', md: 'transparent' }}
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
										borderColor='border.default'
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
										borderColor='border.default'
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
