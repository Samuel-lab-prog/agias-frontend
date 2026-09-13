import { documents } from '@Api/documents/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { Feedback, FormField } from '../../components/UI';
import { dateLabel } from '../../utils';
export function VerifyDocumentPage() {
	const [params] = useSearchParams();
	const query = useMutation({ mutationFn: documents.verify });
	return (
		<Box as='main' minH='100dvh' bg='bg.canvas' p={{ base: 4, md: 10 }}>
			<VStack align='stretch' maxW='760px' mx='auto' gap={6}>
				<Box>
					<Text color='action.primary' fontWeight='bold'>
						AGIAS
					</Text>
					<Heading as='h1' fontSize='3xl' mt={2}>
						Validar documento
					</Heading>
					<Text mt={2} color='fg.muted'>
						Confira a situação do registro usando o código de autenticidade impresso no documento.
					</Text>
				</Box>
				<Surface variant='panel'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							query.mutate(String(new FormData(e.currentTarget).get('code')).trim().toLowerCase());
						}}
					>
						<VStack align='stretch' gap={4}>
							<FormField label='Código de autenticidade' required>
								<Input
									name='code'
									defaultValue={params.get('code') ?? ''}
									required
									minLength={48}
									maxLength={48}
									pattern='[a-fA-F0-9]{48}'
									autoComplete='off'
								/>
							</FormField>
							<Feedback error={query.error} />
							<BaseButton type='submit' disabled={query.isPending} w='fit-content'>
								Consultar autenticidade
							</BaseButton>
						</VStack>
					</form>
				</Surface>
				{query.data && (
					<Surface variant='panel'>
						<VStack align='stretch' gap={3}>
							<Heading
								as='h2'
								fontSize='xl'
								color={query.data.revokedAt ? 'status.error' : 'status.success'}
							>
								{query.data.revokedAt ? 'Documento revogado' : 'Registro válido no AGIAS'}
							</Heading>
							<Text fontWeight='semibold'>{query.data.title}</Text>
							<Text>{query.data.subjectName}</Text>
							<Text>
								{query.data.institution} · {query.data.campus}
							</Text>
							<Text color='fg.muted'>Emitido em {dateLabel(query.data.issuedAt)}</Text>
							{query.data.revokedAt && <Text>Revogado em {dateLabel(query.data.revokedAt)}</Text>}
							<Text fontSize='sm' color='fg.muted'>
								Compare estas informações com o documento apresentado. Esta consulta verifica o
								registro no sistema e não representa assinatura digital.
							</Text>
						</VStack>
					</Surface>
				)}
				<HStack>
					<BaseButton asChild variant='secondary'>
						<a href='/login'>Ir para o portal</a>
					</BaseButton>
				</HStack>
			</VStack>
		</Box>
	);
}

