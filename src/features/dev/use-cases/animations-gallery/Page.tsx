import { Surface } from '@BaseComponents';
import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';

import { DevSubNav } from '../../components/DevSubNav';

type AnimationToken = {
	name: string;
	description: string;
	value: string;
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

function AnimationCard({ token }: { token: AnimationToken }) {
	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }} borderRadius='2xl'>
			<Stack gap={4}>
				<Stack gap={1}>
					<Text fontWeight='semibold'>{token.name}</Text>
					<Text fontSize='sm' color='fg.muted'>
						{token.description}
					</Text>
				</Stack>
				<Box
					h='120px'
					borderRadius='xl'
					border='1px solid'
					borderColor='border.default'
					bg='action.primarySubtle'
					display='grid'
					placeItems='center'
					overflow='hidden'
				>
					<Box
						w='48px'
						h='48px'
						borderRadius='full'
						bg='accent'
						animationName={token.value}
						animationDuration='1s'
						animationTimingFunction='ease-in-out'
						animationIterationCount={token.name === 'bounceFadeIn' ? 'infinite' : '1'}
					/>
				</Box>
				<Text fontSize='xs' color='fg.muted'>
					{token.value}
				</Text>
			</Stack>
		</Surface>
	);
}

export function DevAnimationsPage() {
	const tokens: AnimationToken[] = [
		{
			name: 'bounceFadeIn',
			description: 'Animação combinada usada para chamar atenção de forma contínua.',
			value: 'bounce, fade-in',
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
					title='Animações'
					description='Correspondente às animações locais usadas no front. Aqui dá para ver o nome e o comportamento visual.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}>
					{tokens.map((token) => (
						<AnimationCard key={token.name} token={token} />
					))}
				</Grid>
			</Stack>
		</Flex>
	);
}
