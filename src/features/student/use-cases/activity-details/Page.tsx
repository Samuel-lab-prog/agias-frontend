/* eslint-disable max-lines, max-lines-per-function -- this route intentionally composes the complete student activity workflow. */
import { academic } from '@Api/academic/endpoints';
import { BaseButton, EmptyStateCard, ErrorStateCard, Surface } from '@BaseComponents';
import { Badge, Box, Grid, Heading, HStack, Image, Text, Textarea, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { ArrowLeft, ClipboardList, FileText, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { studentNavigationPreset } from '../../utils/navigation-routes';
import { useStudentActivityDetails } from './hooks/useStudentActivityDetails';

const statusStyles = {
	pending: { bg: 'status.warningSubtle', color: 'status.warning' },
	overdue: { bg: 'status.errorSubtle', color: 'status.error' },
	submitted: { bg: 'action.primarySubtle', color: 'action.primaryStrong' },
	graded: { bg: 'action.primarySubtle', color: 'action.primary' },
} as const;

function formatFileSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SelectedFilePreview({ file }: { file: File }) {
	const isImage = file.type.startsWith('image/');
	const isAudio = file.type.startsWith('audio/');
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!isImage && !isAudio) {
			setPreviewUrl(null);
			return;
		}
		const nextPreviewUrl = URL.createObjectURL(file);
		setPreviewUrl(nextPreviewUrl);
		return () => {
			URL.revokeObjectURL(nextPreviewUrl);
		};
	}, [file, isAudio, isImage]);

	if (!previewUrl) return null;
	if (isImage) {
		return (
			<Image
				src={previewUrl}
				alt={`Pré-visualização de ${file.name}`}
				boxSize='48px'
				objectFit='cover'
				borderRadius='md'
				flexShrink={0}
			/>
		);
	}

	return (
		<Box minW={0} width='full' maxW='220px'>
			<audio
				controls
				preload='metadata'
				src={previewUrl}
				aria-label={`Pré-visualização de ${file.name}`}
				style={{ width: '100%', height: '32px' }}
			/>
		</Box>
	);
}

export function StudentActivityDetailsPage() {
	const { details, dashboard, isLoading, isError, isInvalidId, isNotFound, refetch } =
		useStudentActivityDetails();
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [comment, setComment] = useState('');
	const [commentError, setCommentError] = useState<string | null>(null);
	const [isCommenting, setIsCommenting] = useState(false);

	async function submitComment() {
		if (!details?.submission || !comment.trim()) return;
		setIsCommenting(true);
		setCommentError(null);
		try {
			await academic.createStudentActivitySubmissionComment.mutate({
				submissionId: details.submission.id,
				body: comment.trim(),
			});
			setComment('');
			await refetch();
		} catch (error) {
			setCommentError(
				error instanceof Error ? error.message : 'Não foi possível enviar o comentário.',
			);
		} finally {
			setIsCommenting(false);
		}
	}

	async function submitActivity() {
		if (
			!details ||
			!dashboard ||
			selectedFiles.length === 0 ||
			(details.status === 'overdue' && !details.allowLateSubmissions)
		)
			return;
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			const attachments = await Promise.all(
				selectedFiles.map(async (file) => {
					const upload = await academic.createStudentActivitySubmissionUploadUrl.mutate({
						activityId: details.activityId,
						fileName: file.name,
						contentType: file.type || undefined,
						contentLength: file.size,
					});
					const formData = new FormData();
					Object.entries(upload.fields).forEach(([key, value]) => formData.append(key, value));
					formData.append('file', file);
					const response = await fetch(upload.uploadUrl, { method: 'POST', body: formData });
					if (!response.ok) {
						const responseMessage = (await response.text()).trim();
						throw new Error(
							`Falha ao enviar um dos arquivos (HTTP ${response.status})${responseMessage ? `: ${responseMessage.slice(0, 160)}` : '.'}`,
						);
					}
					return {
						fileName: file.name,
						fileUrl: upload.fileUrl,
						contentType: file.type || undefined,
						fileSize: file.size,
					};
				}),
			);
			await academic.createStudentActivitySubmission.mutate({
				activityId: details.activityId,
				studentProfileId: dashboard.profile.id,
				attachments,
			});
			setSelectedFiles([]);
			if (inputRef.current) inputRef.current.value = '';
			await refetch();
		} catch (error) {
			setSubmitError(
				error instanceof TypeError && error.message === 'Failed to fetch'
					? 'Não foi possível conectar ao servidor. Tente novamente.'
					: error instanceof Error
						? error.message
						: 'Não foi possível enviar a atividade.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	const canSubmit = details ? details.status !== 'overdue' || details.allowLateSubmissions : false;

	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			{isLoading ? <Surface variant='panel' minH='220px' /> : null}
			{isError ? (
				<ErrorStateCard
					eyebrow='ATIVIDADE'
					title='Não foi possível carregar os detalhes'
					description='Verifique sua conexão e tente novamente.'
					actionLabel='Tentar novamente'
					onAction={() => void refetch()}
				/>
			) : null}
			{!isLoading && !isError && (isInvalidId || isNotFound) ? (
				<EmptyStateCard
					eyebrow='ATIVIDADE'
					eyebrowIcon={ClipboardList}
					title='Atividade não encontrada'
					description='Esta atividade não existe ou não está vinculada ao seu perfil.'
					action={
						<BaseButton asChild size='sm' variant='secondary'>
							<NavLink to='/student'>Voltar ao início</NavLink>
						</BaseButton>
					}
				/>
			) : null}
			{details ? (
				<VStack align='stretch' gap={4}>
					<Surface variant='panel'>
						<VStack align='stretch' gap={4}>
							<HStack justify='space-between' align='start' gap={4} flexWrap='wrap'>
								<HStack align='start' gap={3}>
									<Box color='action.primary' pt={1}>
										<ClipboardList size={22} />
									</Box>
									<Box>
										<Text color='fg.muted' fontSize='sm'>
											{details.subjectCode} · {details.subjectTitle}
										</Text>
										<Heading as='h1' fontSize={{ base: 'xl', md: '2xl' }}>
											{details.title}
										</Heading>
									</Box>
								</HStack>
								<Badge
									bg={statusStyles[details.status].bg}
									color={statusStyles[details.status].color}
								>
									{details.statusLabel}
								</Badge>
							</HStack>
							<BaseButton asChild variant='secondary' size='sm' alignSelf='start'>
								<NavLink to={`/student/subjects/${details.enrollmentId}`}>
									<ArrowLeft size={16} /> Voltar para a disciplina
								</NavLink>
							</BaseButton>
						</VStack>
					</Surface>
					<Grid templateColumns={{ base: '1fr', lg: '1.15fr 0.85fr' }} gap={4} alignItems='start'>
						<Surface variant='panel'>
							<HStack gap={2} mb={4}>
								<FileText size={18} />
								<Heading as='h2' fontSize='lg'>
									Instruções
								</Heading>
							</HStack>
							<Text color={details.description ? 'fg.default' : 'fg.muted'} whiteSpace='pre-wrap'>
								{details.description ?? 'Nenhuma instrução adicional foi informada.'}
							</Text>
							<Text color='fg.muted' fontSize='sm' mt={5}>
								Publicada em {details.createdLabel}
							</Text>
						</Surface>
						<Surface variant='panel'>
							<Heading as='h2' fontSize='lg' mb={4}>
								Entrega
							</Heading>
							<VStack align='stretch' gap={3}>
								<Box>
									<HStack align='end' justify='space-between' gap={4} flexWrap='wrap'>
										<Box>
											<Text color='fg.muted' fontSize='sm'>
												Prazo
											</Text>
											<Text fontWeight='medium'>{details.dueLabel}</Text>
										</Box>
										{details.submission ? (
											<Box>
												<Text color='fg.muted' fontSize='sm'>
													Enviada em
												</Text>
												<Text fontWeight='medium'>{details.submission.submittedLabel}</Text>
											</Box>
										) : null}
									</HStack>
									{details.submissionTiming ? (
										<Text
											color={`status.${details.submissionTiming.tone}`}
											fontSize='sm'
											fontWeight='medium'
											mt={1}
										>
											{details.submissionTiming.label}
										</Text>
									) : null}
									{details.overdueLabel ? (
										<Text color='status.error' fontSize='sm' fontWeight='medium'>
											{details.overdueLabel}
										</Text>
									) : null}
									{details.status === 'overdue' && !details.allowLateSubmissions ? (
										<Text color='status.error' fontSize='sm'>
											O prazo foi encerrado e esta atividade não aceita mais envios.
										</Text>
									) : null}
								</Box>
								{details.submission ? (
									<>
										<Box>
											<Text color='fg.muted' fontSize='sm'>
												Avaliação
											</Text>
											<Text fontWeight='medium'>
												{details.submission.grade ? 'Avaliada' : 'Aguardando avaliação'}
											</Text>
										</Box>
										{details.submission.grade ? (
											<Box>
												<Text color='fg.muted' fontSize='sm'>
													Nota
												</Text>
												<Text fontWeight='bold'>{details.submission.grade}</Text>
											</Box>
										) : null}
										{details.submission.feedback ? (
											<Box>
												<Text color='fg.muted' fontSize='sm'>
													Feedback
												</Text>
												<Text whiteSpace='pre-wrap'>{details.submission.feedback}</Text>
											</Box>
										) : null}
										{details.submission.attachments.length ? (
											<Box>
												<Text color='fg.muted' fontSize='sm' mb={1}>
													Arquivos entregues
												</Text>
												<VStack align='stretch' gap={1}>
													{details.submission.attachments.map((attachment) => (
														<a
															key={attachment.fileUrl}
															href={attachment.fileUrl}
															target='_blank'
															rel='noreferrer'
														>
															<Text color='action.primary' fontSize='sm'>
																{attachment.fileName}
															</Text>
														</a>
													))}
												</VStack>
											</Box>
										) : null}
										<Box>
											<Text color='fg.muted' fontSize='sm' mb={1}>
												Comentários
											</Text>
											{details.submission.comments.length ? (
												details.submission.comments.map((item) => (
													<Box
														key={item.id}
														p={2}
														borderWidth='1px'
														borderColor='border.muted'
														borderRadius='md'
														mb={2}
													>
														<Text color='fg.muted' fontSize='xs' fontWeight='semibold'>
															{item.authorName}
														</Text>
														<Text fontSize='sm'>{item.body}</Text>
														<Text color='fg.muted' fontSize='xs'>
															{new Intl.DateTimeFormat('pt-BR', {
																dateStyle: 'short',
																timeStyle: 'short',
															}).format(new Date(item.createdAt))}
														</Text>
													</Box>
												))
											) : (
												<Text color='fg.muted' fontSize='sm'>
													Nenhum comentário enviado.
												</Text>
											)}
											<Textarea
												value={comment}
												onChange={(event) => setComment(event.target.value)}
												placeholder='Escreva uma mensagem para o professor'
												mt={2}
											/>
											<BaseButton
												type='button'
												variant='secondary'
												size='sm'
												disabled={!comment.trim()}
												loading={isCommenting}
												onClick={() => void submitComment()}
												mt={2}
											>
												Enviar comentário
											</BaseButton>
											{commentError ? (
												<Text color='status.error' fontSize='sm' mt={1}>
													{commentError}
												</Text>
											) : null}
										</Box>
									</>
								) : (
									<>
										<Text color='fg.muted' fontSize='sm'>
											Selecione os arquivos que deseja enviar.
										</Text>
										{!canSubmit ? (
											<Text color='status.error' fontSize='sm'>
												Os envios estão encerrados para esta atividade.
											</Text>
										) : null}
										{selectedFiles.length ? (
											<Text fontSize='sm' fontWeight='medium'>
												{selectedFiles.length} arquivo(s) selecionado(s)
											</Text>
										) : null}
										<input
											ref={inputRef}
											type='file'
											multiple
											hidden
											disabled={!canSubmit}
											onChange={(event) => {
												const incomingFiles = Array.from(event.target.files ?? []);
												setSelectedFiles((current) => {
													const existingKeys = new Set(
														current.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
													);
													return [
														...current,
														...incomingFiles.filter(
															(file) =>
																!existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`),
														),
													];
												});
												event.target.value = '';
											}}
										/>
										<BaseButton
											type='button'
											variant='secondary'
											size='sm'
											onClick={() => inputRef.current?.click()}
											disabled={!canSubmit}
										>
											{selectedFiles.length && canSubmit ? (
												<>
													<Plus size={15} /> Adicionar outro arquivo
												</>
											) : (
												'Selecionar arquivos'
											)}
										</BaseButton>
										{selectedFiles.length ? (
											<VStack align='stretch' gap={2}>
												{selectedFiles.map((file, index) => (
													<VStack
														key={`${file.name}-${file.lastModified}-${index}`}
														align='stretch'
														gap={2}
														p={2.5}
														borderWidth='1px'
														borderColor='border.muted'
														borderRadius='md'
													>
														<HStack justify='space-between' gap={3} minW={0}>
															<HStack minW={0} gap={2}>
																{!file.type.startsWith('audio/') ? (
																	<SelectedFilePreview file={file} />
																) : null}
																<FileText size={16} />
																<Box minW={0}>
																	<Text fontSize='sm' fontWeight='medium' truncate>
																		{file.name}
																	</Text>
																	<Text color='fg.muted' fontSize='xs'>
																		{file.type || 'Tipo não informado'} ·{' '}
																		{formatFileSize(file.size)}
																	</Text>
																</Box>
															</HStack>
															<BaseButton
																type='button'
																variant='subtle'
																size='sm'
																aria-label={`Remover ${file.name}`}
																onClick={() =>
																	setSelectedFiles((current) =>
																		current.filter((_, fileIndex) => fileIndex !== index),
																	)
																}
															>
																<X size={14} />
															</BaseButton>
														</HStack>
														{file.type.startsWith('audio/') ? (
															<SelectedFilePreview file={file} />
														) : null}
													</VStack>
												))}
											</VStack>
										) : null}
										{selectedFiles.length ? (
											<BaseButton
												type='button'
												variant='primary'
												size='sm'
												loading={isSubmitting}
												disabled={!canSubmit}
												onClick={() => void submitActivity()}
											>
												Enviar atividade
											</BaseButton>
										) : null}
										{submitError ? (
											<Text color='status.error' fontSize='sm'>
												{submitError}
											</Text>
										) : null}
									</>
								)}
							</VStack>
						</Surface>
					</Grid>
				</VStack>
			) : null}
		</NavigationPageShell>
	);
}
