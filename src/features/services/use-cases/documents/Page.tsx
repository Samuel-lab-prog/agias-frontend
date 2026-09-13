import { type DocumentKind, documents, type IssuedDocument } from '@Api/documents/endpoints';
import { projects } from '@Api/projects/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import {
	Box,
	Heading,
	HStack,
	Input,
	NativeSelect,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ServicesShell } from '../../components/Shell';
import {
	Feedback,
	FormField,
	ServiceHeader,
	ServiceLink,
	ServiceState,
} from '../../components/UI';
import { dateLabel } from '../../utils';
export function DocumentCard({ doc, manager = false }: { doc: IssuedDocument; manager?: boolean }) {
	const client = useQueryClient();
	const revoke = useMutation({
		mutationFn: (reason: string) => documents.revoke(doc.id, reason),
		onSuccess: () => client.invalidateQueries({ queryKey: ['documents'] }),
	});
	return (
		<Surface variant='panel'>
			<VStack align='stretch' gap={3}>
				<Heading as='h3' fontSize='lg'>
					{doc.snapshot.title}
				</Heading>
				<Text>{doc.snapshot.subjectName}</Text>
				<Text color='fg.muted' fontSize='sm'>
					{dateLabel(doc.createdAt)} · {doc.revokedAt || revoke.isSuccess ? 'Revogado' : 'Emitido'}
				</Text>
				<HStack flexWrap='wrap'>
					{!doc.revokedAt && !revoke.isSuccess && (
						<BaseButton asChild size='sm'>
							<a href={documents.pdfUrl(doc.id)} target='_blank' rel='noreferrer'>
								Baixar PDF
							</a>
						</BaseButton>
					)}
					<BaseButton asChild variant='secondary' size='sm'>
						<Link to={'/documents/verify?code=' + doc.verificationCode}>
							Verificar autenticidade
						</Link>
					</BaseButton>
				</HStack>
				{manager && !doc.revokedAt && !revoke.isSuccess && (
					<details>
						<summary>Revogar documento</summary>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								revoke.mutate(String(new FormData(e.currentTarget).get('reason')));
							}}
						>
							<VStack align='stretch' gap={3} mt={3}>
								<Text fontSize='sm'>
									A revogação é definitiva e será indicada na consulta de autenticidade.
								</Text>
								<FormField label='Motivo da revogação' required>
									<Textarea name='reason' required minLength={5} maxLength={2000} />
								</FormField>
								<BaseButton type='submit' disabled={revoke.isPending} variant='secondary'>
									Confirmar revogação
								</BaseButton>
							</VStack>
						</form>
					</details>
				)}
				<Feedback
					error={revoke.error}
					success={revoke.isSuccess ? 'Documento revogado.' : undefined}
				/>
			</VStack>
		</Surface>
	);
}
export function DocumentsPage() {
	const user = useAuthClientStore((s) => s.authClient),
		manager = ['staff', 'admin'].includes(user?.role ?? '');
	const client = useQueryClient(),
		[kind, setKind] = useState<DocumentKind>(
			user?.role === 'student' || manager ? 'enrollment' : 'participation',
		),
		[participantId, setParticipantId] = useState(''),
		[subjectId, setSubjectId] = useState(''),
		[search, setSearch] = useState('');
	const query = useQuery({ queryKey: ['documents', user?.id], queryFn: documents.list });
	const candidates = useQuery({
		queryKey: ['document-candidates', search],
		queryFn: () => projects.candidates(search),
		enabled: manager && search.length >= 2,
	});
	const participations = useQuery({
		queryKey: ['document-participations', user?.id],
		queryFn: documents.participations,
	});
	const issue = useMutation({
		mutationFn: () =>
			documents.issue({
				kind,
				...(subjectId ? { subjectUserId: Number(subjectId) } : {}),
				...(kind === 'participation' ? { participantId: Number(participantId) } : {}),
			}),
		onSuccess: () => client.invalidateQueries({ queryKey: ['documents'] }),
	});
	return (
		<ServicesShell>
			<VStack align='stretch' gap={6}>
				<ServiceHeader
					title='Documentos'
					description='Emita declarações a partir dos registros acadêmicos vigentes e consulte sua autenticidade.'
					action={<ServiceLink to='/documents/verify'>Validar documento</ServiceLink>}
				/>
				<Surface variant='panel'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							issue.mutate();
						}}
					>
						<VStack align='stretch' gap={4}>
							<Heading as='h2' fontSize='xl'>
								Nova emissão
							</Heading>
							<FormField label='Documento' required>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={kind}
										onChange={(e) => {
											setKind(e.target.value as DocumentKind);
											setSubjectId('');
											issue.reset();
										}}
									>
										<option value='enrollment'>Atestado de matrícula</option>
										<option value='affiliation'>Declaração de vínculo</option>
										<option value='participation'>Certificado de participação em projeto</option>
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
							{kind === 'participation' ? (
								<>
									<FormField label='Participação concluída' required>
										<NativeSelect.Root>
											<NativeSelect.Field
												value={participantId}
												onChange={(e) => setParticipantId(e.target.value)}
											>
												<option value=''>Selecione sua participação</option>
												{participations.data?.map((p) => (
													<option value={p.id} key={p.id}>
														{p.project.title} · {p.approvedHours} horas
													</option>
												))}
											</NativeSelect.Field>
											<NativeSelect.Indicator />
										</NativeSelect.Root>
									</FormField>
									<Text color='fg.muted' fontSize='sm'>
										Disponível para projetos concluídos, após aprovação da carga horária.
									</Text>
									<Feedback error={participations.error} />
								</>
							) : (
								<>
									{manager && (
										<>
											<FormField label='Buscar aluno pelo nome'>
												<Input
													value={search}
													onChange={(e) => {
														setSearch(e.target.value);
														setSubjectId('');
														issue.reset();
													}}
													minLength={2}
													maxLength={100}
												/>
											</FormField>
											<FormField label='Aluno' required>
												<NativeSelect.Root>
													<NativeSelect.Field
														value={subjectId}
														onChange={(e) => {
															setSubjectId(e.target.value);
															issue.reset();
														}}
													>
														<option value=''>Selecione o aluno</option>
														{candidates.data
															?.filter((p) => p.role === 'student')
															.map((p) => (
																<option value={p.id} key={p.id}>
																	{p.name}
																</option>
															))}
													</NativeSelect.Field>
													<NativeSelect.Indicator />
												</NativeSelect.Root>
											</FormField>
											<Feedback error={candidates.error} />
										</>
									)}
									<Text color='fg.muted' fontSize='sm'>
										É necessário ter vínculo ativo com o curso e matrícula ativa em um período
										letivo vigente.
									</Text>
								</>
							)}
							<Feedback error={issue.error} />
							<BaseButton
								type='submit'
								w='fit-content'
								disabled={
									issue.isPending ||
									(kind === 'participation' && !participantId) ||
									(manager && kind !== 'participation' && !subjectId)
								}
							>
								{issue.isPending ? 'Emitindo…' : 'Emitir documento'}
							</BaseButton>
						</VStack>
					</form>
				</Surface>
				{issue.data && (
					<Box>
						<Heading as='h2' fontSize='xl' mb={3}>
							Documento emitido
						</Heading>
						<DocumentCard doc={issue.data} manager={manager} />
					</Box>
				)}
				<Box>
					<Heading as='h2' fontSize='xl' mb={4}>
						{manager ? 'Documentos do campus' : 'Meus documentos'}
					</Heading>
					<ServiceState query={query}>
						<VStack align='stretch' gap={4}>
							{query.data?.length === 0 && (
								<Text color='fg.muted'>Você ainda não possui documentos emitidos.</Text>
							)}
							{query.data?.map((doc) => (
								<DocumentCard key={doc.id} doc={doc} manager={manager} />
							))}
						</VStack>
					</ServiceState>
				</Box>
				<Text color='fg.muted' fontSize='sm'>
					Boletim, histórico, frequência e conclusão de curso serão disponibilizados após a
					implantação das regras e registros de homologação acadêmica.
				</Text>
			</VStack>
		</ServicesShell>
	);
}

