import { BaseButton, ErrorStateCard, Surface } from '@BaseComponents';
import { Box, Field, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { errorText } from '../utils';
export function ServiceState({
	query,
	children,
}: {
	query: { isPending: boolean; isError: boolean; error: unknown; refetch: () => unknown };
	children: ReactNode;
}) {
	if (query.isPending)
		return (
			<HStack role='status'>
				<Spinner size='sm' />
				<Text>Carregando…</Text>
			</HStack>
		);
	if (query.isError)
		return (
			<ErrorStateCard
				title='Não foi possível carregar'
				description={errorText(query.error)}
				actionLabel='Tentar novamente'
				onAction={() => void query.refetch()}
			/>
		);
	return children;
}
export function ServiceHeader({
	title,
	description,
	action,
}: {
	title: string;
	description: string;
	action?: ReactNode;
}) {
	return (
		<HStack justify='space-between' align='start' flexWrap='wrap' gap={4}>
			<Box>
				<Heading as='h1' fontSize={{ base: '2xl', md: '3xl' }}>
					{title}
				</Heading>
				<Text mt={2} color='fg.muted' maxW='700px'>
					{description}
				</Text>
			</Box>
			{action}
		</HStack>
	);
}
export function FormField({
	label,
	children,
	required = false,
}: {
	label: string;
	children: ReactNode;
	required?: boolean;
}) {
	return (
		<Field.Root required={required}>
			<Field.Label>
				{label}
				{required && <Field.RequiredIndicator />}
			</Field.Label>
			{children}
		</Field.Root>
	);
}
export function Feedback({ error, success }: { error: unknown; success?: string }) {
	return error ? (
		<Text color='status.error' role='alert'>
			{errorText(error)}
		</Text>
	) : success ? (
		<Text color='status.success' role='status'>
			{success}
		</Text>
	) : null;
}
export function EmptyPanel({ children }: { children: ReactNode }) {
	return (
		<Surface variant='panel'>
			<VStack align='start' gap={3}>
				{children}
			</VStack>
		</Surface>
	);
}
export function ServiceLink({ to, children }: { to: string; children: ReactNode }) {
	return (
		<BaseButton asChild variant='secondary' size='sm'>
			<Link to={to}>{children}</Link>
		</BaseButton>
	);
}
