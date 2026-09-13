import {
	type IdentityBody,
	institution,
	type InstitutionContext,
} from '@Api/institution/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Input, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ServicesShell } from '../../components/Shell';
import { Feedback, FormField, ServiceHeader, ServiceState } from '../../components/UI';
function IdentityForm({ data }: { data: InstitutionContext }) {
	const client = useQueryClient();
	const [body, setBody] = useState<IdentityBody>({
		institutionName: data.campus.institution.configured ? data.campus.institution.name : '',
		acronym: data.campus.institution.configured ? data.campus.institution.acronym : '',
		campusName: data.campus.institution.configured ? data.campus.name : '',
		city: data.campus.city,
		state: data.campus.state,
		address: data.campus.address,
	});
	const mutation = useMutation({
		mutationFn: institution.saveIdentity,
		onSuccess: () => client.invalidateQueries({ queryKey: ['institution-context'] }),
	});
	const fields: [keyof IdentityBody, string, number][] = [
		['institutionName', 'Nome da instituição', 200],
		['acronym', 'Sigla', 30],
		['campusName', 'Nome do campus', 150],
		['city', 'Cidade', 100],
		['state', 'UF', 2],
		['address', 'Endereço', 300],
	];
	return (
		<Surface variant='panel'>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					mutation.mutate(body);
				}}
			>
				<VStack align='stretch' gap={5}>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						{fields.map(([key, label, max]) => (
							<FormField label={label} required key={key}>
								<Input
									required
									minLength={key === 'address' ? 5 : key === 'institutionName' ? 3 : 2}
									maxLength={max}
									value={body[key]}
									onChange={(e) =>
										setBody({
											...body,
											[key]: key === 'state' ? e.target.value.toUpperCase() : e.target.value,
										})
									}
								/>
							</FormField>
						))}
					</SimpleGrid>
					<Feedback
						error={mutation.error}
						success={mutation.isSuccess ? 'Identificação institucional atualizada.' : undefined}
					/>
					<BaseButton type='submit' disabled={mutation.isPending} w='fit-content'>
						Salvar identificação
					</BaseButton>
				</VStack>
			</form>
		</Surface>
	);
}
export function InstitutionPage() {
	const account = useAuthClientStore((s) => s.authClient);
	const query = useQuery({
		queryKey: ['institution-context', account?.id],
		queryFn: institution.context,
	});
	return (
		<ServicesShell>
			<VStack align='stretch' gap={6}>
				<ServiceHeader
					title='Instituição e campus'
					description='Defina a identificação exibida no portal e nos documentos emitidos.'
				/>
				<Text color='fg.muted' fontSize='sm'>
					Esta instalação opera um campus. Os dados existentes pertencem ao campus inicial; preencha
					a identificação correspondente.
				</Text>
				<ServiceState query={query}>
					{query.data && <IdentityForm data={query.data} />}
				</ServiceState>
			</VStack>
		</ServicesShell>
	);
}
