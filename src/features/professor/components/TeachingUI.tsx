import { BaseButton, EmptyStateCard, ErrorStateCard, Surface } from '@BaseComponents';
import { Box, Heading, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { ArrowRight, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { errorMessage } from '../utils';

export function PageHeader({
	title,
	description,
	action,
	eyebrow = 'Espaço docente',
}: {
	title: string;
	description: string;
	action?: ReactNode;
	eyebrow?: string;
}) {
	return (
		<HStack justify='space-between' align='start' flexWrap='wrap' gap={4} py={2}>
			<Box minW={0} flex='1' flexBasis='260px'>
				<Text
					fontSize='xs'
					fontWeight='semibold'
					letterSpacing='0.1em'
					textTransform='uppercase'
					color='action.primary'
					mb={2}
				>
					{eyebrow}
				</Text>
				<Heading
					as='h1'
					fontSize={{ base: '2xl', md: '3xl' }}
					lineHeight='1.2'
					letterSpacing='-0.025em'
					overflowWrap='anywhere'
				>
					{title}
				</Heading>
				<Text mt={2} color='fg.muted' fontSize='sm' maxW='640px'>
					{description}
				</Text>
			</Box>
			{action}
		</HStack>
	);
}

export function SectionHeading({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<HStack justify='space-between' align='start' flexWrap='wrap' gap={3} mb={5}>
			<Box>
				<Heading as='h2' fontSize='lg' letterSpacing='-0.015em'>
					{title}
				</Heading>
				{description && (
					<Text color='fg.muted' fontSize='sm' mt={1}>
						{description}
					</Text>
				)}
			</Box>
			{action}
		</HStack>
	);
}

export function IconTile({ icon: Icon }: { icon: LucideIcon }) {
	return (
		<Box
			display='inline-flex'
			w='fit-content'
			p={3}
			bg='action.primarySubtle'
			color='action.primary'
			borderRadius='xl'
			flexShrink={0}
		>
			<Icon size={21} aria-hidden='true' />
		</Box>
	);
}

export function StatCard({
	label,
	value,
	icon,
	hint,
}: {
	label: string;
	value: number;
	icon: LucideIcon;
	hint: string;
}) {
	return (
		<Surface variant='panel'>
			<HStack justify='space-between' align='start' gap={3}>
				<Box>
					<Text fontSize='sm' color='fg.muted'>
						{label}
					</Text>
					<Text
						fontSize='3xl'
						fontWeight='bold'
						lineHeight='1.2'
						mt={2}
						fontVariantNumeric='tabular-nums'
					>
						{value.toLocaleString('pt-BR')}
					</Text>
				</Box>
				<IconTile icon={icon} />
			</HStack>
			<Text mt={3} fontSize='xs' color='fg.muted'>
				{hint}
			</Text>
		</Surface>
	);
}

export function StatusPill({
	children,
	tone = 'neutral',
}: {
	children: ReactNode;
	tone?: 'neutral' | 'accent' | 'warning' | 'success';
}) {
	const color = {
		neutral: 'fg.muted',
		accent: 'action.primary',
		warning: 'status.warning',
		success: 'status.success',
	}[tone];
	return (
		<Text
			as='span'
			display='inline-flex'
			alignItems='center'
			alignSelf='start'
			gap={1}
			px={2.5}
			py={1}
			borderRadius='full'
			bg={tone === 'accent' ? 'action.primarySubtle' : 'bg.muted'}
			color={color}
			fontSize='xs'
			fontWeight='semibold'
			lineHeight='1.5'
		>
			{children}
		</Text>
	);
}

export function ActionLink({ to, children }: { to: string; children: ReactNode }) {
	return (
		<BaseButton asChild variant='subtle' size='sm' flexShrink={0}>
			<Link to={to}>
				{children}
				<ArrowRight size={15} aria-hidden='true' />
			</Link>
		</BaseButton>
	);
}

export function QueryState({
	query,
	empty,
	children,
}: {
	query: { isPending: boolean; isError: boolean; error: unknown; refetch: () => unknown };
	empty?: { title: string; description: string; action?: ReactNode } | false;
	children: ReactNode;
}) {
	if (query.isPending)
		return (
			<VStack align='stretch' gap={3} role='status' aria-label='Carregando conteúdo'>
				<Text fontSize='sm' color='fg.muted'>
					Carregando…
				</Text>
				{[0, 1, 2].map((item) => (
					<Skeleton key={item} height='112px' borderRadius='xl' />
				))}
			</VStack>
		);
	if (query.isError)
		return (
			<ErrorStateCard
				eyebrow='Não foi possível carregar'
				title='Vamos tentar novamente?'
				description={errorMessage(query.error)}
				actionLabel='Tentar novamente'
				onAction={() => void query.refetch()}
			/>
		);
	if (empty) return <EmptyStateCard {...empty} />;
	return children;
}

export function Pagination({
	page,
	total,
	pageSize,
	onChange,
}: {
	page: number;
	total: number;
	pageSize: number;
	onChange: (page: number) => void;
}) {
	const pages = Math.max(1, Math.ceil(total / pageSize));
	return (
		<HStack as='nav' aria-label='Paginação' justify='space-between' flexWrap='wrap' gap={3} pt={3}>
			<Text color='fg.muted' fontSize='sm' role='status'>
				{total.toLocaleString('pt-BR')} {total === 1 ? 'resultado' : 'resultados'} · Página {page}{' '}
				de {pages}
			</Text>
			<HStack gap={2}>
				<BaseButton
					variant='secondary'
					size='sm'
					disabled={page <= 1}
					onClick={() => onChange(page - 1)}
				>
					<ChevronLeft size={16} aria-hidden='true' />
					Anterior
				</BaseButton>
				<BaseButton
					variant='secondary'
					size='sm'
					disabled={page >= pages}
					onClick={() => onChange(page + 1)}
				>
					Próxima
					<ChevronRight size={16} aria-hidden='true' />
				</BaseButton>
			</HStack>
		</HStack>
	);
}

export function MutationFeedback({
	error,
	isSuccess,
	success,
}: {
	error: unknown;
	isSuccess: boolean;
	success: string;
}) {
	if (error)
		return (
			<Text role='alert' fontSize='sm' color='status.error'>
				{errorMessage(error)}
			</Text>
		);
	return isSuccess ? (
		<Text role='status' fontSize='sm' color='status.success'>
			{success}
		</Text>
	) : null;
}
