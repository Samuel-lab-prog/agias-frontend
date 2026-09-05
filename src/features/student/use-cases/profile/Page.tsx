import { academic } from '@Api/academic/endpoints';
import { academicKeys } from '@Api/academic/keys';
import type { StudentProfile } from '@Api/academic/types';
import { users } from '@Api/users/endpoints';
import { userKeys } from '@Api/users/keys';
import type { UserProfile } from '@Api/users/types';
import { BaseButton, DynamicForm, ErrorStateCard, type Field,Surface } from '@BaseComponents';
import { Box, Grid, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, GraduationCap, LockKeyhole, UserRound } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';

import { studentNavigationPreset } from '../../utils/navigation-routes';

type ProfileForm = { email: string };
type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };

const profileFields: Field<ProfileForm>[] = [
	{ name: 'email', label: 'E-mail de contato', required: true, type: 'text' },
];
const passwordFields: Field<PasswordForm>[] = [
	{ name: 'currentPassword', label: 'Senha atual', type: 'password', required: true },
	{ name: 'newPassword', label: 'Nova senha', type: 'password', required: true, minLength: 8 },
	{
		name: 'confirmPassword',
		label: 'Confirmar nova senha',
		type: 'password',
		required: true,
		minLength: 8,
	},
];

function formatStatus(status: string | undefined) {
	if (status === 'active') return 'Ativo';
	if (status === 'blocked') return 'Bloqueado';
	if (status === 'suspended') return 'Suspenso';
	return status ?? 'Não informado';
}

function formatRole(role: string | undefined) {
	if (role === 'student') return 'Aluno';
	if (role === 'professor') return 'Professor';
	if (role === 'staff') return 'Servidor';
	if (role === 'admin') return 'Administrador';
	return role ?? 'Não informado';
}

function getPasswordErrorMessage(error: unknown) {
	const message =
		error instanceof Error
			? error.message
			: typeof error === 'object' && error !== null && 'message' in error
				? String(error.message)
				: '';
	if (message.toLowerCase().includes('current password does not match')) {
		return 'A senha atual está incorreta.';
	}
	return message || 'Não foi possível alterar a senha. Tente novamente.';
}

function AcademicSummary({ profile }: { profile?: StudentProfile }) {
	return (
		<Surface variant='panel'>
			<HeadingRow icon={<GraduationCap size={18} />} title='Informações acadêmicas' />
			<Grid as='dl' templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap={4}>
				<SummaryItem label='Matrícula' value={profile?.academicId ?? 'Não informada'} />
				<SummaryItem
					label='Curso'
					value={profile?.courseId ? `Curso ${profile.courseId}` : 'Não vinculado'}
				/>
				<SummaryItem
					label='Ano de entrada'
					value={profile?.admissionYear?.toString() ?? 'Não informado'}
				/>
				<SummaryItem label='Status' value={formatStatus(profile?.status)} />
			</Grid>
		</Surface>
	);
}

function SummaryItem({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
	return (
		<Box>
			<Text as='dt' fontSize='sm' color='fg.muted'>
				{label}
			</Text>
			<Text as='dd' fontWeight='medium' mt={1} color={valueColor}>
				{value}
			</Text>
		</Box>
	);
}

function HeadingRow({ icon, title }: { icon: ReactNode; title: string }) {
	return (
		<HStack gap={2} mb={4}>
			{icon}
			<Heading as='h2' fontSize='lg'>
				{title}
			</Heading>
		</HStack>
	);
}

export function StudentProfilePage() {
	const clientId = useAuthClientStore((state) => state.authClient?.id ?? null);
	const queryClient = useQueryClient();
	const userQuery = useQuery({
		queryKey: userKeys.myProfile(),
		enabled: clientId !== null,
		queryFn: () => users.getMyProfile.query().queryFn() as Promise<UserProfile>,
	});
	const academicQuery = useQuery({
		queryKey: academicKeys.myStudentProfile(),
		enabled: clientId !== null,
		queryFn: () => academic.getMyStudentProfile.query().queryFn() as Promise<StudentProfile>,
	});
	const profileForm = useForm<ProfileForm>({ mode: 'onChange' });
	const passwordForm = useForm<PasswordForm>({ mode: 'onChange' });
	const newPassword = passwordForm.watch('newPassword');
	const confirmPassword = passwordForm.watch('confirmPassword');
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const [avatarError, setAvatarError] = useState('');

	useEffect(() => {
		if (!confirmPassword) {
			passwordForm.clearErrors('confirmPassword');
			return;
		}
		if (newPassword !== confirmPassword) {
			passwordForm.setError('confirmPassword', {
				type: 'validate',
				message: 'As senhas não correspondem.',
			});
		} else {
			passwordForm.clearErrors('confirmPassword');
		}
	}, [confirmPassword, newPassword, passwordForm]);

	useEffect(() => {
		if (!userQuery.data) return;
		profileForm.reset({
			email: userQuery.data.email ?? '',
		});
	}, [profileForm, userQuery.data]);

	const updateMutation = useMutation({
		mutationFn: (data: ProfileForm) => users.updateUser.mutate(data) as Promise<UserProfile>,
		onSuccess: (profile) => {
			queryClient.setQueryData(userKeys.myProfile(), profile);
			profileForm.reset({ email: profile.email ?? '' });
		},
	});
	const passwordMutation = useMutation({
		onError: (error) => {
			passwordForm.setError('currentPassword', {
				type: 'server',
				message: getPasswordErrorMessage(error),
			});
		},
		mutationFn: (data: PasswordForm) =>
			users.changePassword.mutate({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			}) as Promise<UserProfile>,
		onSuccess: () => passwordForm.reset(),
	});
	const avatarMutation = useMutation({
		mutationFn: async (file: File) => {
			const upload = (await users.requestAvatarUploadUrl.mutate({
				contentType: file.type || 'image/jpeg',
				contentLength: file.size,
			})) as { uploadUrl: string; fields: Record<string, string>; fileUrl: string };
			const body = new FormData();
			Object.entries(upload.fields).forEach(([key, value]) => body.append(key, value));
			body.append('file', file);
			const response = await fetch(upload.uploadUrl, { method: 'POST', body });
			if (!response.ok) throw new Error('Falha no upload da foto.');
			return users.setAvatar.mutate({ avatarUrl: upload.fileUrl }) as Promise<UserProfile>;
		},
		onSuccess: (profile) => {
			queryClient.setQueryData(userKeys.myProfile(), profile);
			setAvatarError('');
		},
		onError: () => setAvatarError('Não foi possível atualizar a foto.'),
	});

	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<BaseButton asChild size='sm' variant='secondary' alignSelf='flex-start' mb={4}>
				<NavLink to='/student'>
					<ArrowLeft size={16} />
					Voltar ao início
				</NavLink>
			</BaseButton>
			{userQuery.isError || academicQuery.isError ? (
				<ErrorStateCard
					eyebrow='PERFIL'
					title='Não foi possível carregar seu perfil'
					description='Verifique sua conexão e tente novamente.'
					actionLabel='Tentar novamente'
					onAction={() => {
						void userQuery.refetch();
						void academicQuery.refetch();
					}}
				/>
			) : (
				<Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 1.1fr) minmax(0, 0.9fr)' }} gap={4}>
					<Surface
						variant='panel'
						gridColumn={{ base: 'auto', lg: '1 / -1' }}
						id='profile-settings'
					>
						<HeadingRow icon={<UserRound size={18} />} title='Foto e perfil' />
						<HStack align='center' gap={4} wrap='wrap'>
							{userQuery.data?.avatarUrl ? (
								<Image
									src={userQuery.data.avatarUrl}
									alt='Foto do perfil'
									boxSize={20}
									borderRadius='full'
									objectFit='cover'
								/>
							) : (
								<Box
									boxSize={20}
									borderRadius='full'
									bg='action.primary'
									color='fg.inverted'
									display='grid'
									placeItems='center'
									fontSize='xl'
									fontWeight='bold'
								>
									{userQuery.data?.name
										?.split(/\s+/)
										.map((part) => part[0])
										.slice(0, 2)
										.join('')
										.toUpperCase() ?? '?'}
								</Box>
							)}
							<Box>
								<Text fontWeight='semibold'>Atualizar foto do perfil</Text>
								<Text color='fg.muted' fontSize='sm' mt={1}>
									Use uma imagem JPG, PNG ou WEBP.
								</Text>
								<input
									ref={avatarInputRef}
									type='file'
									accept='image/jpeg,image/png,image/webp'
									hidden
									onChange={(event) => {
										const file = event.target.files?.[0];
										event.target.value = '';
										if (file) avatarMutation.mutate(file);
									}}
								/>
								<BaseButton
									type='button'
									variant='secondary'
									size='sm'
									mt={3}
									loading={avatarMutation.isPending}
									onClick={() => avatarInputRef.current?.click()}
								>
									Escolher foto
								</BaseButton>
								{avatarError ? (
									<Text color='status.error' fontSize='sm' mt={2}>
										{avatarError}
									</Text>
								) : null}
							</Box>
						</HStack>
					</Surface>
					<Surface variant='panel' id='personal-data'>
						<HeadingRow icon={<UserRound size={18} />} title='Informações pessoais' />
						<Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap={4} mb={5}>
							<SummaryItem label='Nome completo' value={userQuery.data?.name ?? 'Não informado'} />
							<SummaryItem
								label='Nome de usuário'
								value={userQuery.data?.nickname ?? 'Não informado'}
							/>
							<SummaryItem label='CPF' value={userQuery.data?.cpf ?? 'Não informado'} />
							<SummaryItem label='RG' value={userQuery.data?.rg ?? 'Não informado'} />
							<SummaryItem label='Perfil' value={formatRole(userQuery.data?.role)} />
							<SummaryItem label='Conta' value={formatStatus(userQuery.data?.status)} />
							<SummaryItem
								label='Cadastro'
								value={
									userQuery.data?.createdAt
										? new Intl.DateTimeFormat('pt-BR').format(new Date(userQuery.data.createdAt))
										: 'Não informado'
								}
							/>
			<SummaryItem
				label='E-mail verificado'
				value={userQuery.data?.emailVerifiedAt ? 'Sim' : 'Pendente'}
				valueColor={userQuery.data?.emailVerifiedAt ? 'status.success' : 'status.warning'}
			/>
							<SummaryItem
								label='E-mail institucional'
								value={
									academicQuery.data?.academicId
										? `${academicQuery.data.academicId}@aluno.osorio.ifrs.edu.br`
										: 'Não informado'
								}
							/>
						</Grid>
						<Text fontSize='sm' color='fg.muted' mb={4}>
							Dados institucionais são mantidos pela instituição e não podem ser alterados aqui.
							O e-mail institucional é gerado pela matrícula e não pode ser alterado.
							Apenas o e-mail pessoal de contato pode ser atualizado.
						</Text>
						<DynamicForm
							fields={profileFields.map((field) => ({ ...field, disabled: userQuery.isLoading }))}
							control={profileForm.control}
							errors={profileForm.formState.errors}
							isValid={profileForm.formState.isValid}
							loading={updateMutation.isPending}
							onSubmit={(data) => updateMutation.mutate(data)}
							handleSubmitFn={profileForm.handleSubmit}
							buttonLabel='Salvar alterações'
							cardProps={{ maxW: 'full', p: 0, border: 'none', bg: 'transparent' }}
							extraContent={
								<>
									{updateMutation.isError ? (
										<Text color='status.error' role='alert'>Não foi possível salvar as alterações.</Text>
									) : null}
									{updateMutation.isSuccess ? (
										<Text color='status.success' role='status'>Perfil atualizado com sucesso.</Text>
									) : null}
								</>
							}
						/>
					</Surface>
					<Box id='academic-data'>
						<AcademicSummary profile={academicQuery.data} />
					</Box>
					<Surface variant='panel' id='security'>
						<HeadingRow icon={<LockKeyhole size={18} />} title='Segurança' />
						<DynamicForm
							fields={passwordFields}
							control={passwordForm.control}
							errors={passwordForm.formState.errors}
							isValid={
								passwordForm.formState.isValid &&
									!passwordForm.formState.errors.confirmPassword && newPassword === confirmPassword
							}
							loading={passwordMutation.isPending}
							onSubmit={(data) => {
								passwordForm.clearErrors('currentPassword');
								passwordMutation.mutate(data);
							}}
							handleSubmitFn={passwordForm.handleSubmit}
							setError={passwordForm.setError}
							clearErrors={passwordForm.clearErrors}
							buttonLabel='Alterar senha'
							columns={2}
							cardProps={{ maxW: 'full', p: 0, border: 'none', bg: 'transparent' }}
							extraContent={
								<>
									{confirmPassword && newPassword !== confirmPassword ? (
										<Text color='status.error' role='alert' fontSize='sm'>
											As senhas não correspondem.
										</Text>
									) : null}
									{passwordMutation.isSuccess ? (
										<Text color='status.success' role='status'>Senha alterada com sucesso.</Text>
									) : null}
								</>
							}
						/>
					</Surface>
				</Grid>
			)}
		</NavigationPageShell>
	);
}
