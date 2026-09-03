import { BaseButton, DarkMode, LightMode, Surface } from '@BaseComponents';
import { Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { DevSubNav } from '../../components/DevSubNav';

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

function ButtonCard({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }} borderRadius='2xl'>
			<Stack gap={3}>
				<Stack gap={1}>
					<Heading size='sm'>{title}</Heading>
					<Text fontSize='sm' color='fg.muted'>
						{description}
					</Text>
				</Stack>
				{children}
			</Stack>
		</Surface>
	);
}

function ModeSection({
	mode,
	title,
	description,
	children,
}: {
	mode: 'light' | 'dark';
	title: string;
	description: string;
	children: ReactNode;
}) {
	const Wrapper = mode === 'light' ? LightMode : DarkMode;

	return (
		<Wrapper>
			<Surface
				variant='panel'
				p={{ base: 4, md: 5 }}
				borderRadius='2xl'
				bg={mode === 'light' ? 'background' : 'surface'}
			>
				<Stack gap={4}>
					<Stack gap={1}>
						<Heading size='sm'>{title}</Heading>
						<Text fontSize='sm' color='fg.muted'>
							{description}
						</Text>
					</Stack>
					{children}
				</Stack>
			</Surface>
		</Wrapper>
	);
}

function ButtonsGrid() {
	return (
		<Grid gap={4} gridTemplateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }}>
			<ButtonCard title='Surface' description='Botão principal com presença forte.'>
				<Stack direction='row' gap={3} wrap='wrap'>
					<BaseButton variant='primary'>Principal</BaseButton>
					<BaseButton variant='primary' disabled>
						Desabilitado
					</BaseButton>
				</Stack>
			</ButtonCard>
			<ButtonCard title='Solid Purple' description='Ação importante com identidade azul.'>
				<Stack direction='row' gap={3} wrap='wrap'>
					<BaseButton variant='primary'>Salvar</BaseButton>
					<BaseButton variant='primary' disabled>
						Salvar
					</BaseButton>
				</Stack>
			</ButtonCard>
			<ButtonCard title='Solid Pink' description='Ação de destaque com tom de alerta positivo.'>
				<Stack direction='row' gap={3} wrap='wrap'>
					<BaseButton variant='primary'>Continuar</BaseButton>
					<BaseButton variant='primary' disabled>
						Continuar
					</BaseButton>
				</Stack>
			</ButtonCard>
			<ButtonCard
				title='Outline Purple'
				description='Ação secundária com borda e contraste mais suave.'
			>
				<Stack direction='row' gap={3} wrap='wrap'>
					<BaseButton variant='secondary'>Cancelar</BaseButton>
					<BaseButton variant='secondary' disabled>
						Cancelar
					</BaseButton>
				</Stack>
			</ButtonCard>
			<ButtonCard
				title='Ghost Pink'
				description='Ação leve, útil para controles menos prioritários.'
			>
				<Stack direction='row' gap={3} wrap='wrap'>
					<BaseButton variant='subtle'>Mais opções</BaseButton>
					<BaseButton variant='subtle' disabled>
						Mais opções
					</BaseButton>
				</Stack>
			</ButtonCard>
			<ButtonCard title='Danger' description='Ações destrutivas e de alto risco.'>
				<Stack direction='row' gap={3} wrap='wrap'>
					<BaseButton variant='destructive'>Excluir</BaseButton>
					<BaseButton variant='destructive' disabled>
						Excluir
					</BaseButton>
				</Stack>
			</ButtonCard>
		</Grid>
	);
}

export function DevButtonsPage() {
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
					title='Buttons'
					description='Catálogo visual das variantes de botão usadas no sistema, com foco em contraste, hierarquia e estados.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', xl: 'repeat(2, minmax(0, 1fr))' }}>
					<ModeSection
						mode='light'
						title='Modo claro'
						description='Como os botões se comportam sobre superfícies claras.'
					>
						<ButtonsGrid />
					</ModeSection>
					<ModeSection
						mode='dark'
						title='Modo escuro'
						description='Os mesmos botões sobre superfícies escuras para validar contraste e peso visual.'
					>
						<ButtonsGrid />
					</ModeSection>
				</Grid>
			</Stack>
		</Flex>
	);
}
