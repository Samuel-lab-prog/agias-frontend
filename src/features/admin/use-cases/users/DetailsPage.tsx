import { administration } from '@Api/admin/endpoints';
import type {
	AdminProfileBody,
	AdminRole,
	AdminStatus,
	AdminUser,
	TeamBody,
} from '@Api/admin/types';
import { BaseButton, Surface } from '@BaseComponents';
import { Heading, Input, NativeSelect, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
	Feedback,
	FormField,
	ServiceHeader,
	ServiceLink,
	ServiceState,
} from '../../../services/components/UI';
import { roleLabels, statusLabels } from '../../utils';
function AccountForm({ user }: { user?: AdminUser }) {
	const navigate = useNavigate(),
		client = useQueryClient();
	const departments = useQuery({
		queryKey: ['administration', 'departments'],
		queryFn: administration.departments,
	});
	const [role, setRole] = useState<AdminRole>(user?.role ?? 'staff');
	const [status, setStatus] = useState<Exclude<AdminStatus, 'pending'>>(
		user?.status === 'pending' ? 'active' : (user?.status ?? 'active'),
	);
	const professional = user?.professorProfile;
	const save = useMutation({
		mutationFn: (data: AdminProfileBody | TeamBody) =>
			user
				? administration.saveProfile(user.id, data)
				: administration.createTeam(data as TeamBody),
		onSuccess: async (data) => {
			await client.invalidateQueries({ queryKey: ['administration'] });
			await client.invalidateQueries({ queryKey: ['institution-context'] });
			if (!user) navigate('/admin/users/' + data.id);
		},
	});
	const access = useMutation({
		mutationFn: () => administration.saveAccess(user!.id, { role, status }),
		onSuccess: () => client.invalidateQueries({ queryKey: ['administration'] }),
	});
	return (
		<VStack align='stretch' gap={5}>
			<Surface variant='panel'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const f = new FormData(e.currentTarget);
						const nullable = (key: string) => String(f.get(key) ?? '').trim() || null;
						const data: AdminProfileBody = {
							name: String(f.get('name')),
							email: String(f.get('email')),
							departmentId: nullable('department') ? Number(f.get('department')) : null,
							registryCode: nullable('registry'),
							title: nullable('title'),
							workload: nullable('workload') ? Number(f.get('workload')) : null,
						};
						if (user) save.mutate(data);
						else
							save.mutate({
								...data,
								role: role as TeamBody['role'],
								nickname: String(f.get('nickname')),
								password: String(f.get('password')),
								cpf: String(f.get('cpf')),
								rg: String(f.get('rg')),
								avatarUrl: null,
							});
					}}
				>
					<VStack align='stretch' gap={5}>
						<Heading as='h2' fontSize='xl'>
							Identificação e vínculo
						</Heading>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<FormField label='Nome completo' required>
								<Input
									name='name'
									defaultValue={user?.name}
									required
									minLength={3}
									maxLength={200}
								/>
							</FormField>
							<FormField label='E-mail' required>
								<Input
									name='email'
									type='email'
									defaultValue={user?.email}
									required
									maxLength={254}
								/>
							</FormField>
						</SimpleGrid>
						{!user && (
							<>
								<FormField label='Função' required>
									<NativeSelect.Root>
										<NativeSelect.Field
											value={role}
											onChange={(e) => setRole(e.target.value as AdminRole)}
										>
											{(['staff', 'professor', 'admin'] as const).map((r) => (
												<option value={r} key={r}>
													{roleLabels[r]}
												</option>
											))}
										</NativeSelect.Field>
										<NativeSelect.Indicator />
									</NativeSelect.Root>
								</FormField>
								<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
									{[
										['nickname', 'Usuário'],
										['cpf', 'CPF'],
										['rg', 'RG'],
										['password', 'Senha inicial'],
									].map(([name, label]) => (
										<FormField key={name} label={label!} required>
											<Input
												name={name}
												required
												type={name === 'password' ? 'password' : 'text'}
												minLength={name === 'password' ? 8 : undefined}
												maxLength={name === 'password' ? 64 : 100}
												autoComplete={name === 'password' ? 'new-password' : 'off'}
											/>
										</FormField>
									))}
								</SimpleGrid>
							</>
						)}
						{['staff', 'professor'].includes(user?.role ?? role) && (
							<FormField label='Departamento'>
								<NativeSelect.Root>
									<NativeSelect.Field
										name='department'
										defaultValue={
											professional?.departmentId ?? user?.staffProfile?.departmentId ?? ''
										}
									>
										<option value=''>Não vinculado</option>
										{departments.data?.map((d) => (
											<option key={d.id} value={d.id}>
												{d.name}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
						)}
						{(user?.role ?? role) === 'professor' && (
							<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
								<FormField label='Registro docente'>
									<Input
										name='registry'
										defaultValue={professional?.registryCode ?? ''}
										maxLength={100}
									/>
								</FormField>
								<FormField label='Titulação'>
									<Input name='title' defaultValue={professional?.title ?? ''} maxLength={200} />
								</FormField>
								<FormField label='Carga horária semanal'>
									<Input
										name='workload'
										type='number'
										min={0}
										max={168}
										defaultValue={professional?.workload ?? ''}
									/>
								</FormField>
							</SimpleGrid>
						)}
						<Feedback
							error={save.error ?? departments.error}
							success={save.isSuccess ? 'Cadastro atualizado.' : undefined}
						/>
						<BaseButton type='submit' disabled={save.isPending} w='fit-content'>
							{user ? 'Salvar cadastro' : 'Cadastrar pessoa'}
						</BaseButton>
					</VStack>
				</form>
			</Surface>
			{user && (
				<Surface variant='panel'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							access.mutate();
						}}
					>
						<VStack align='stretch' gap={4}>
							<Heading as='h2' fontSize='xl'>
								Acesso ao portal
							</Heading>
							<Text color='fg.muted'>
								Situação atual: {statusLabels[user.status]}. Mudanças de função respeitam os
								vínculos acadêmicos existentes.
							</Text>
							<FormField label='Papel no sistema'>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={role}
										onChange={(e) => setRole(e.target.value as AdminRole)}
									>
										{Object.entries(roleLabels).map(([r, label]) => (
											<option key={r} value={r}>
												{label}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
							<FormField label='Situação'>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={status}
										onChange={(e) => setStatus(e.target.value as typeof status)}
									>
										{(['active', 'blocked', 'suspended'] as const).map((s) => (
											<option key={s} value={s}>
												{statusLabels[s]}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
							<Feedback
								error={access.error}
								success={access.isSuccess ? 'Acesso atualizado.' : undefined}
							/>
							<BaseButton
								type='submit'
								disabled={access.isPending}
								w='fit-content'
								variant='secondary'
							>
								Atualizar acesso
							</BaseButton>
						</VStack>
					</form>
				</Surface>
			)}
		</VStack>
	);
}
export function UserDetailsPage({ create = false }: { create?: boolean }) {
	const id = Number(useParams().userId);
	const query = useQuery({
		queryKey: ['administration', 'user', id],
		queryFn: () => administration.user(id),
		enabled: !create,
	});
	return (
		<VStack align='stretch' gap={6}>
			<ServiceHeader
				title={create ? 'Cadastrar equipe' : (query.data?.name ?? 'Cadastro da pessoa')}
				description='Gerencie os dados de identificação, o vínculo profissional e o acesso ao portal.'
				action={<ServiceLink to='/admin/team'>Voltar à equipe</ServiceLink>}
			/>
			{create ? (
				<AccountForm />
			) : (
				<ServiceState query={query}>
					{query.data && <AccountForm key={query.data.id} user={query.data} />}
				</ServiceState>
			)}
		</VStack>
	);
}
