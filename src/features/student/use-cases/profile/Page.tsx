/* eslint-disable max-lines, max-lines-per-function -- profile composes the complete student registration workflow. */
import { academic } from '@Api/academic/endpoints';
import { academicKeys } from '@Api/academic/keys';
import type { StudentProfile } from '@Api/academic/types';
import { users } from '@Api/users/endpoints';
import { userKeys } from '@Api/users/keys';
import type { UserProfile } from '@Api/users/types';
import { BaseButton, DynamicForm, ErrorStateCard, type Field, Surface } from '@BaseComponents';
import { Box, Grid, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, GraduationCap, LockKeyhole, UserRound } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';

import { studentNavigationPreset } from '../../utils/navigation-routes';

type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };
type StudentDetailsForm = {
	email: string;
	currentPassword: string;
	birthDate: string;
	gender: string;
	genderIdentity: string;
	sexualOrientation: string;
	race: string;
	nationality: string;
	birthplace: string;
	birthCountry: string;
	maritalStatus: string;
	bloodType: string;
	disability: string;
	fatherName: string;
	motherName: string;
	postalCode: string;
	street: string;
	addressNumber: string;
	addressComplement: string;
	neighborhood: string;
	state: string;
	city: string;
	phone: string;
	mobilePhone: string;
	familyIncomeRange: string;
};

const formatPhone = (value: string) => {
	const digits = value.replace(/\D/g, '').slice(0, 11);
	if (digits.length <= 2) return digits ? `(${digits}` : '';
	const area = `(${digits.slice(0, 2)}) `;
	const body = digits.slice(2);
	if (body.length <= 4) return area + body;
	if (digits.length <= 10) return `${area}${body.slice(0, 4)}-${body.slice(4)}`;
	return `${area}${body.slice(0, 5)}-${body.slice(5)}`;
};

const formatPostalCode = (value: string) => {
	const digits = value.replace(/\D/g, '').slice(0, 8);
	return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};

const passwordFields: Field<PasswordForm>[] = [
	{
		name: 'currentPassword',
		label: 'Senha atual para confirmar',
		type: 'password',
		required: true,
	},
	{ name: 'newPassword', label: 'Nova senha', type: 'password', required: true, minLength: 8 },
	{
		name: 'confirmPassword',
		label: 'Confirmar nova senha',
		type: 'password',
		required: true,
		minLength: 8,
	},
];
const studentDetailsFields: Field<StudentDetailsForm>[] = [
	{
		name: 'email',
		label: 'E-mail de contato',
		required: true,
		type: 'text',
		pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Informe um e-mail válido.' },
	},
	{ name: 'birthDate', label: 'Data de nascimento', type: 'date', disabled: true },
	{
		kind: 'select',
		name: 'gender',
		label: 'Sexo atribuído ao nascer',
		disabled: true,
		options: [
			{ value: 'Masculino', label: 'Masculino' },
			{ value: 'Feminino', label: 'Feminino' },
			{ value: 'Não informado', label: 'Não informado' },
		],
	},
	{
		kind: 'select',
		name: 'genderIdentity',
		label: 'Identidade de gênero',
		options: [
			{ value: 'Mulher cisgênero', label: 'Mulher cisgênero' },
			{ value: 'Homem cisgênero', label: 'Homem cisgênero' },
			{ value: 'Mulher trans', label: 'Mulher trans' },
			{ value: 'Homem trans', label: 'Homem trans' },
			{ value: 'Pessoa não binária', label: 'Pessoa não binária' },
			{ value: 'Pessoa agênero', label: 'Pessoa agênero' },
			{ value: 'Gênero fluido', label: 'Gênero fluido' },
			{ value: 'Bigênero', label: 'Bigênero' },
			{ value: 'Outra', label: 'Outra' },
			{ value: 'Prefiro não informar', label: 'Prefiro não informar' },
		],
	},
	{
		kind: 'select',
		name: 'sexualOrientation',
		label: 'Orientação sexual',
		options: [
			{ value: 'Heterossexual', label: 'Heterossexual' },
			{ value: 'Homossexual', label: 'Homossexual' },
			{ value: 'Bissexual', label: 'Bissexual' },
			{ value: 'Pansexual', label: 'Pansexual' },
			{ value: 'Assexual', label: 'Assexual' },
			{ value: 'Demissexual', label: 'Demissexual' },
			{ value: 'Queer', label: 'Queer' },
			{ value: 'Outra', label: 'Outra' },
			{ value: 'Prefiro não informar', label: 'Prefiro não informar' },
		],
	},
	{
		kind: 'select',
		name: 'race',
		label: 'Raça/cor',
		options: [
			{ value: 'Branca', label: 'Branca' },
			{ value: 'Preta', label: 'Preta' },
			{ value: 'Parda', label: 'Parda' },
			{ value: 'Amarela', label: 'Amarela' },
			{ value: 'Indígena', label: 'Indígena' },
			{ value: 'Não informado', label: 'Não informado' },
		],
	},
	{ name: 'nationality', label: 'Nacionalidade', type: 'text', disabled: true },
	{
		name: 'birthplace',
		label: 'Naturalidade',
		type: 'text',
		disabled: true,
		pattern: { value: /^[^/]+$/, message: 'Informe apenas o nome da cidade.' },
	},
	{ name: 'birthCountry', label: 'País de nascimento', type: 'text', disabled: true },
	{
		kind: 'select',
		name: 'maritalStatus',
		label: 'Estado civil',
		options: [
			{ value: 'Solteiro', label: 'Solteiro(a)' },
			{ value: 'Casado', label: 'Casado(a)' },
			{ value: 'Divorciado', label: 'Divorciado(a)' },
			{ value: 'Viúvo', label: 'Viúvo(a)' },
		],
	},
	{
		kind: 'select',
		name: 'bloodType',
		label: 'Tipo sanguíneo',
		options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((value) => ({
			value,
			label: value,
		})),
	},
	{
		name: 'disability',
		label: 'Deficiência ou necessidade especial',
		type: 'text',
	},
	{ name: 'fatherName', label: 'Nome do pai', type: 'text', disabled: true },
	{ name: 'motherName', label: 'Nome da mãe', type: 'text', disabled: true },
	{
		name: 'postalCode',
		label: 'CEP',
		type: 'text',
		maxLength: 9,
		pattern: { value: /^\d{5}-?\d{3}$/, message: 'Informe um CEP válido.' },
		transformValue: formatPostalCode,
	},
	{ name: 'street', label: 'Logradouro', type: 'text' },
	{ name: 'addressNumber', label: 'Número', type: 'text' },
	{ name: 'addressComplement', label: 'Complemento', type: 'text' },
	{ name: 'neighborhood', label: 'Bairro', type: 'text' },
	{
		kind: 'select',
		name: 'state',
		label: 'UF',
		disabled: true,
		options: [
			'AC',
			'AL',
			'AP',
			'AM',
			'BA',
			'CE',
			'DF',
			'ES',
			'GO',
			'MA',
			'MT',
			'MS',
			'MG',
			'PA',
			'PB',
			'PR',
			'PE',
			'PI',
			'RJ',
			'RN',
			'RS',
			'RO',
			'RR',
			'SC',
			'SP',
			'SE',
			'TO',
		].map((value) => ({ value, label: value })),
	},
	{ name: 'city', label: 'Município', type: 'text', disabled: true },
	{ name: 'phone', label: 'Telefone', type: 'text', transformValue: formatPhone },
	{ name: 'mobilePhone', label: 'Celular', type: 'text', transformValue: formatPhone },
	{
		kind: 'select',
		name: 'familyIncomeRange',
		label: 'Renda familiar per capita (em salários mínimos)',
		options: [
			['ATE_0_5_SM', 'Até ½ salário mínimo'],
			['DE_0_5_A_1_SM', 'Mais de ½ até 1 salário mínimo'],
			['DE_1_A_2_SM', 'Mais de 1 até 2 salários mínimos'],
			['DE_2_A_3_SM', 'Mais de 2 até 3 salários mínimos'],
			['DE_3_A_5_SM', 'Mais de 3 até 5 salários mínimos'],
			['ACIMA_DE_5_SM', 'Acima de 5 salários mínimos'],
			['NAO_DECLARADA', 'Não declarada'],
			['PREFIRO_NAO_INFORMAR', 'Prefiro não informar'],
		].map(([value, label]) => ({ value, label })),
	},
	{
		name: 'currentPassword',
		label: 'Senha atual para confirmar',
		type: 'password',
		required: true,
	},
];

const nonEditableStudentDetailsFields = new Set<keyof StudentDetailsForm>([
	'birthDate',
	'gender',
	'birthCountry',
	'fatherName',
	'motherName',
	'nationality',
	'birthplace',
	'state',
]);

const editableStudentDetailsFields = studentDetailsFields.filter(
	(field) => field.kind === 'custom' || !nonEditableStudentDetailsFields.has(field.name),
);

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

function SummaryItem({
	label,
	value,
	valueColor,
}: {
	label: string;
	value: string;
	valueColor?: string;
}) {
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
	const passwordForm = useForm<PasswordForm>({ mode: 'onChange' });
	const studentDetailsForm = useForm<StudentDetailsForm>({ mode: 'onChange' });
	const newPassword = passwordForm.watch('newPassword');
	const confirmPassword = passwordForm.watch('confirmPassword');
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const [avatarError, setAvatarError] = useState('');
	const [postalCodeError, setPostalCodeError] = useState('');
	const studentDetailsMutation = useMutation({
		mutationFn: async (data: StudentDetailsForm) => {
			const profile = (await academic.updateStudentProfile.mutate({
				...Object.fromEntries(
					Object.entries(data)
						.filter(
							([key]) =>
								key !== 'email' &&
								!nonEditableStudentDetailsFields.has(key as keyof StudentDetailsForm),
						)
						.map(([key, value]) => [key, value === '' ? null : value]),
				),
				currentPassword: data.currentPassword,
				state: data.state || undefined,
				familyIncomeRange: data.familyIncomeRange || null,
			})) as StudentProfile;
			queryClient.setQueryData(academicKeys.myStudentProfile(), profile);
			if (data.email !== userQuery.data?.email) {
				try {
					const user = (await users.updateUser.mutate({
						email: data.email,
						currentPassword: data.currentPassword,
					})) as UserProfile;
					queryClient.setQueryData(userKeys.myProfile(), user);
				} catch {
					throw new Error(
						'Os dados cadastrais foram salvos, mas não foi possível atualizar o e-mail de contato. Confira o e-mail e tente novamente.',
					);
				}
			}
			return profile;
		},
		onSuccess: (profile) => {
			queryClient.setQueryData(academicKeys.myStudentProfile(), profile);
			void queryClient.invalidateQueries({ queryKey: academicKeys.myStudentProfile() });
		},
		onError: (error) => {
			const message = (error as { message?: string })?.message;
			studentDetailsForm.setError(
				message === 'Current password does not match' ? 'currentPassword' : 'root.server',
				{
					type: 'server',
					message:
						message === 'Current password does not match'
							? 'A senha atual não confere.'
							: message === 'Birth date cannot be in the future'
								? 'A data de nascimento não pode ser futura.'
								: message === 'Validation failed'
									? 'Há dados inválidos no cadastro. Verifique os campos e tente novamente.'
									: (message ?? 'Não foi possível salvar os dados cadastrais.'),
				},
			);
		},
	});

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
		const profile = academicQuery.data;
		if (!profile || !userQuery.data) return;
		studentDetailsForm.reset(
			Object.fromEntries(
				studentDetailsFields
					.filter((field) => field.kind !== 'custom')
					.map((field) => {
						const value =
							field.name === 'email'
								? userQuery.data.email
								: profile[field.name as keyof StudentProfile];
						return [
							field.name,
				field.name === 'currentPassword'
					? ''
									: field.name === 'birthDate' && value
										? String(value).slice(0, 10)
										: value === null || value === undefined
											? ''
											: String(value),
						];
					}),
			) as StudentDetailsForm,
		);
	}, [academicQuery.data, studentDetailsForm, userQuery.data]);
	const postalCode = studentDetailsForm.watch('postalCode');
	useEffect(() => {
		const digits = postalCode?.replace(/\D/g, '') ?? '';
		if (digits.length !== 8) {
			setPostalCodeError('');
			return;
		}
		let cancelled = false;
		void fetch(`https://viacep.com.br/ws/${digits}/json/`)
			.then((response) => (response.ok ? response.json() : null))
			.then(
				(
					data: {
						erro?: boolean;
						logradouro?: string;
						bairro?: string;
						uf?: string;
						localidade?: string;
					} | null,
				) => {
					if (cancelled) return;
					if (!data || data.erro) {
						setPostalCodeError('CEP não encontrado.');
						return;
					}
					if (data.logradouro && !studentDetailsForm.getValues('street')) {
						studentDetailsForm.setValue('street', data.logradouro);
					}
					if (data.bairro && !studentDetailsForm.getValues('neighborhood')) {
						studentDetailsForm.setValue('neighborhood', data.bairro);
					}
					studentDetailsForm.setValue('state', data.uf ?? '');
					studentDetailsForm.setValue('city', data.localidade ?? '');
					setPostalCodeError('');
				},
			)
			.catch(() => {
				if (!cancelled) setPostalCodeError('Não foi possível consultar o CEP.');
			});
		return () => {
			cancelled = true;
		};
	}, [postalCode, studentDetailsForm]);

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
				<>
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
								<SummaryItem
									label='Nome completo'
									value={userQuery.data?.name ?? 'Não informado'}
								/>
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
						</Surface>
						<Box id='academic-data'>
							<AcademicSummary profile={academicQuery.data} />
						</Box>
						<Surface variant='panel' gridColumn={{ base: 'auto', lg: '1 / -1' }}>
							<HeadingRow icon={<UserRound size={18} />} title='Dados cadastrais' />
							<Text fontSize='sm' color='fg.muted' mb={4}>
								Atualize seus dados pessoais, endereço e contatos. Dados acadêmicos e documentos
								oficiais são mantidos pela instituição.
							</Text>
							<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={3} mb={5}>
								{studentDetailsFields
					.filter(
						(field): field is Exclude<Field<StudentDetailsForm>, { kind: 'custom' } | { kind: 'dedication' }> =>
							field.kind !== 'custom' && field.kind !== 'dedication' && nonEditableStudentDetailsFields.has(field.name),
					)
									.map((field) => (
										<Box key={field.name}>
											<Text fontSize='xs' color='fg.muted'>
												{field.label}
											</Text>
											<Text>
												{field.name === 'birthDate' && academicQuery.data?.birthDate
													? new Date(academicQuery.data.birthDate).toLocaleDateString('pt-BR')
													: String(
															academicQuery.data?.[field.name as keyof StudentProfile] ??
																'Não informado',
														)}
											</Text>
										</Box>
									))}
							</Grid>
							<DynamicForm
								fields={editableStudentDetailsFields}
								control={studentDetailsForm.control}
								errors={studentDetailsForm.formState.errors}
								isValid={studentDetailsForm.formState.isValid}
								loading={studentDetailsMutation.isPending}
								onSubmit={(data) => studentDetailsMutation.mutate(data)}
								handleSubmitFn={studentDetailsForm.handleSubmit}
								buttonLabel='Salvar dados cadastrais'
								columns={2}
								cardProps={{
									maxW: 'full',
									p: { base: 0, md: 1 },
									border: 'none',
									bg: 'transparent',
								}}
								extraContent={
									studentDetailsForm.formState.errors.root?.server ? (
										<Text color='status.error' role='alert'>
											{studentDetailsForm.formState.errors.root.server.message}
										</Text>
									) : postalCodeError ? (
										<Text color='status.error'>{postalCodeError}</Text>
									) : studentDetailsMutation.isSuccess ? (
										<Text color='status.success'>Dados cadastrais atualizados com sucesso.</Text>
									) : null
								}
							/>
						</Surface>
						<Surface variant='panel' id='security'>
							<HeadingRow icon={<LockKeyhole size={18} />} title='Segurança' />
							<DynamicForm
								fields={passwordFields}
								control={passwordForm.control}
								errors={passwordForm.formState.errors}
								isValid={
									passwordForm.formState.isValid &&
									!passwordForm.formState.errors.confirmPassword &&
									newPassword === confirmPassword
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
								cardProps={{
									maxW: 'full',
									p: { base: 0, md: 1 },
									border: 'none',
									bg: 'transparent',
								}}
								extraContent={
									<>
										{confirmPassword && newPassword !== confirmPassword ? (
											<Text color='status.error' role='alert' fontSize='sm'>
												As senhas não correspondem.
											</Text>
										) : null}
										{passwordMutation.isSuccess ? (
											<Text color='status.success' role='status'>
												Senha alterada com sucesso.
											</Text>
										) : null}
									</>
								}
							/>
						</Surface>
					</Grid>
				</>
			)}
		</NavigationPageShell>
	);
}
