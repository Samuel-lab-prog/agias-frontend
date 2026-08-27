/* eslint-disable max-lines-per-function */
import type { Field } from '@BaseComponents';
// eslint-disable-next-line no-duplicate-imports
import {
	AudioField,
	BaseButton,
	DynamicForm,
	FileField,
	FormButton,
	FormField,
	SearchInput,
	SelectField,
	Surface,
	TagsField,
} from '@BaseComponents';
import { Flex, Grid, Heading, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { type ReactNode, useMemo, useState } from 'react';
import { type FieldError, useForm } from 'react-hook-form';

import { DevSubNav } from '../../components/DevSubNav';

type DevFormValues = {
	title: string;
	description: string;
	category: string;
	tags: string[];
	cover: File | null;
	audio: File | null;
	slug: string;
	summary: string;
	status: string;
	highlightTags: string[];
	previewCover: File | null;
	voiceNote: File | null;
};

function SectionTitle({ title, description }: { title: string; description: string }) {
	return (
		<Stack gap={1.5}>
			<Heading size={{ base: 'sm', md: 'md' }}>{title}</Heading>
			<Text color='fg.muted' maxW='2xl' fontSize={{ base: 'sm', md: 'md' }} lineHeight='1.55'>
				{description}
			</Text>
		</Stack>
	);
}

function ComponentCard({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }} borderRadius={{ base: 'xl', md: '2xl' }}>
			<Stack gap={{ base: 3, md: 4 }}>
				<Stack gap={1}>
					<Heading size={{ base: 'xs', md: 'sm' }}>{title}</Heading>
					<Text fontSize={{ base: 'xs', md: 'sm' }} color='fg.muted' lineHeight='1.5'>
						{description}
					</Text>
				</Stack>
				{children}
			</Stack>
		</Surface>
	);
}

function makeManualError(message: string): FieldError {
	return {
		type: 'manual',
		message,
	};
}

export function DevComponentsPage() {
	const [query, setQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const [manualErrorMode, setManualErrorMode] = useState(false);

	const form = useForm<DevFormValues>({
		mode: 'onChange',
		defaultValues: {
			title: 'Hello Poetry',
			description: 'Texto de exemplo para revisão visual.',
			category: 'article',
			tags: ['design', 'ui'],
			cover: null,
			audio: null,
			slug: 'hello-poetry',
			summary: 'Resumo curto para testar limite e quebra visual.',
			status: 'draft',
			highlightTags: ['ui', 'accessibility', 'system'],
			previewCover: null,
			voiceNote: null,
		},
	});

	const forceErrors = () => {
		form.setError('title', makeManualError('Título obrigatório para este exemplo.'));
		form.setError('description', makeManualError('Descrição curta demais para revisão.'));
		form.setError('category', makeManualError('Selecione uma categoria.'));
		form.setError('tags', makeManualError('Adicione pelo menos uma tag válida.'));
		form.setError('cover', makeManualError('Envie uma imagem para validar o upload.'));
		form.setError('audio', makeManualError('Inclua um áudio para concluir.'));
	};

	const dynamicFields = useMemo<Field<DevFormValues>[]>(
		() => [
			{
				kind: 'input',
				name: 'title',
				label: 'Título',
				required: true,
				maxLength: 80,
				debounce: 250,
			},
			{ kind: 'input', name: 'slug', label: 'Slug', required: true, maxLength: 60, debounce: 250 },
			{
				kind: 'input',
				name: 'description',
				label: 'Descrição',
				type: 'textarea',
				rows: 4,
				maxLength: 240,
			},
			{
				kind: 'input',
				name: 'summary',
				label: 'Resumo',
				type: 'textarea',
				rows: 3,
				minLength: 30,
				maxLength: 120,
				delay: 140,
			},
			{
				kind: 'select',
				name: 'category',
				label: 'Categoria',
				options: [
					{ value: 'article', label: 'Artigo' },
					{ value: 'poem', label: 'Poema' },
					{ value: 'note', label: 'Nota' },
				],
			},
			{
				kind: 'select',
				name: 'status',
				label: 'Status',
				placeholder: 'Escolha um status',
				options: [
					{ value: 'draft', label: 'Rascunho' },
					{ value: 'review', label: 'Em revisão' },
					{ value: 'published', label: 'Publicado' },
				],
			},
			{
				kind: 'tags',
				name: 'tags',
				label: 'Tags',
				placeholder: 'Digite e enter',
				maxTags: 5,
				maxTagLength: 16,
				filterForbiddenWords: true,
			},
			{
				kind: 'tags',
				name: 'highlightTags',
				label: 'Tags de destaque',
				placeholder: 'Até 3 tags',
				maxTags: 3,
				maxTagLength: 12,
				delay: 260,
			},
			{
				kind: 'file',
				name: 'cover',
				label: 'Capa',
				preview: 'image',
				validateFile: (file) => {
					if (!file) return null;
					if (!file.type.startsWith('image/')) return 'Envie uma imagem válida.';
					if (file.size > 2_000_000) return 'A imagem precisa ter até 2 MB.';
					return null;
				},
			},
			{
				kind: 'file',
				name: 'previewCover',
				label: 'Capa de prévia',
				preview: 'image',
				buttonLabel: 'Escolher imagem',
				helpText: 'Exemplo com validação e preview para documentos maiores.',
				validateFile: (file) => {
					if (!file) return null;
					if (file.size > 500_000) return 'Use um arquivo com até 500 KB.';
					return null;
				},
			},
			{
				kind: 'audio',
				name: 'audio',
				label: 'Áudio',
				labels: {
					record: 'Gravar trecho',
					stop: 'Parar',
					discard: 'Descartar',
					upload: 'Enviar arquivo',
					clear: 'Limpar',
					previewRecorded: 'Prévia gravada',
					previewUploaded: 'Prévia enviada',
				},
			},
			{ kind: 'audio', name: 'voiceNote', label: 'Nota de voz', disabled: true },
		],
		[],
	);

	return (
		<Flex as='main' layerStyle='mainPadded' direction='column' gap={{ base: 6, md: 8 }} pb={12}>
			<DevSubNav />
			<Stack gap={{ base: 3, md: 4 }}>
				<SectionTitle
					title='Campos básicos'
					description='Os blocos mais simples para revisar labels, erro, foco, espaçamento e limites.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}>
					<ComponentCard
						title='FormField'
						description='Input e textarea com validação, contador, debounce e erro simulado.'
					>
						<Stack gap={3}>
							<FormField
								control={form.control}
								name='title'
								label='Título'
								required
								maxLength={80}
								showCharacterCount
								debounce={280}
								asyncValidator={async (value) => {
									if (!value.trim()) return 'Preencha o título.';
									if (value.trim().toLowerCase() === 'hello poetry') {
										return 'Troque o título para algo único.';
									}
									return null;
								}}
								error={
									manualErrorMode
										? makeManualError('Título muito genérico. Ajuste para algo mais específico.')
										: form.formState.errors.title
								}
							/>
							<FormField
								control={form.control}
								name='description'
								label='Descrição'
								as='textarea'
								rows={4}
								minLength={40}
								maxLength={240}
								showCharacterCount
								error={
									manualErrorMode
										? makeManualError('A descrição precisa ser mais completa.')
										: form.formState.errors.description
								}
							/>
							<FormField
								control={form.control}
								name='slug'
								label='Slug'
								required
								disabled
								error={
									manualErrorMode
										? makeManualError('Slug inválido: use letras minúsculas, números e hífens.')
										: form.formState.errors.slug
								}
							/>
						</Stack>
					</ComponentCard>
					<ComponentCard
						title='SelectField'
						description='Select com placeholder, transformação e estado de erro.'
					>
						<Stack gap={3}>
							<SelectField
								control={form.control}
								name='category'
								label='Categoria'
								placeholder='Escolha uma categoria'
								options={[
									{ value: 'article', label: 'Artigo' },
									{ value: 'poem', label: 'Poema' },
									{ value: 'note', label: 'Nota' },
								]}
								error={
									manualErrorMode
										? (makeManualError('Selecione uma categoria antes de continuar.') as never)
										: form.formState.errors.category
								}
							/>
							<SelectField
								control={form.control}
								name='status'
								label='Status'
								placeholder='Selecione um status'
								options={[
									{ value: 'draft', label: 'Rascunho' },
									{ value: 'review', label: 'Em revisão' },
									{ value: 'published', label: 'Publicado' },
								]}
								transformValue={(value) => value.toUpperCase()}
								disabled
							/>
						</Stack>
					</ComponentCard>
				</Grid>
			</Stack>

			<Stack gap={{ base: 3, md: 4 }}>
				<SectionTitle
					title='Campos especiais'
					description='Os componentes mais personalizados do core para upload, áudio, tags e busca.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', xl: 'repeat(2, minmax(0, 1fr))' }}>
					<ComponentCard
						title='TagsField'
						description='Tags com limite, dedupe, sanitização e mensagens de validação.'
					>
						<Stack gap={3}>
							<TagsField
								control={form.control}
								name='tags'
								label='Tags'
								placeholder='Digite e enter'
								maxTags={5}
								maxTagLength={16}
								filterForbiddenWords
								error={
									manualErrorMode
										? (makeManualError('Limite de tags excedido.') as never)
										: form.formState.errors.tags
								}
							/>
							<TagsField
								control={form.control}
								name='highlightTags'
								label='Tags de destaque'
								placeholder='Até 3 tags'
								maxTags={3}
								maxTagLength={12}
								disabled
							/>
						</Stack>
					</ComponentCard>
					<ComponentCard
						title='FileField'
						description='Upload com preview, validação de arquivo e estado desabilitado.'
					>
						<Stack gap={3}>
							<FileField
								control={form.control}
								name='cover'
								label='Capa'
								buttonLabel='Selecionar arquivo'
								helpText='Use uma imagem para testar preview e limite de tamanho.'
								preview='image'
								validateFile={(file) => {
									if (!file) return null;
									if (!file.type.startsWith('image/')) return 'Selecione um arquivo de imagem.';
									if (file.size > 2_000_000) return 'A imagem deve ter até 2 MB.';
									return null;
								}}
								error={
									manualErrorMode
										? makeManualError('Arquivo fora do padrão esperado.')
										: form.formState.errors.cover
								}
							/>
							<FileField
								control={form.control}
								name='previewCover'
								label='Arquivo de prévia'
								buttonLabel='Upload alternativo'
								helpText='Mesmo componente em um cenário menor e com mensagem auxiliar.'
								preview='image'
								disabled
							/>
						</Stack>
					</ComponentCard>
					<ComponentCard
						title='AudioField'
						description='Upload e gravação de áudio com labels customizadas.'
					>
						<Stack gap={3}>
							<AudioField
								control={form.control}
								name='audio'
								label='Áudio'
								labels={{
									record: 'Gravar trecho',
									stop: 'Parar',
									discard: 'Descartar',
									upload: 'Enviar arquivo',
									clear: 'Limpar',
									previewRecorded: 'Prévia gravada',
									previewUploaded: 'Prévia enviada',
								}}
								error={
									manualErrorMode
										? makeManualError('Áudio indisponível para este exemplo.')
										: form.formState.errors.audio
								}
							/>
							<AudioField control={form.control} name='voiceNote' label='Nota de voz' disabled />
						</Stack>
					</ComponentCard>
					<ComponentCard title='SearchInput' description='Campo com debounce para buscas.'>
						<SearchInput
							label='Buscar componentes'
							placeholder='Digite algo...'
							value={query}
							onValueChange={setQuery}
							onDebouncedChange={setDebouncedQuery}
						/>
						<Text fontSize='sm' color='fg.muted'>
							Debounced: {debouncedQuery || 'vazio'}
						</Text>
					</ComponentCard>
				</Grid>
			</Stack>

			<Stack gap={{ base: 3, md: 4 }}>
				<SectionTitle
					title='DynamicForm'
					description='O formulário completo montado a partir dos descriptors do core, com limites e validações reais.'
				/>
				<ComponentCard
					title='Exemplo completo'
					description='DynamicForm com todos os tipos de campo, versões curtas e estados simulados.'
				>
					<Stack gap={4}>
						<Flex gap={3} wrap='wrap'>
							<BaseButton variant='solid' onClick={forceErrors}>
								Forçar erros
							</BaseButton>
							<BaseButton
								variant='outline'
								onClick={() => setManualErrorMode((current) => !current)}
							>
								{manualErrorMode ? 'Ocultar erros simulados' : 'Mostrar erros simulados'}
							</BaseButton>
							<BaseButton
								variant='ghost'
								onClick={() => {
									form.clearErrors();
									setManualErrorMode(false);
								}}
							>
								Limpar erros
							</BaseButton>
						</Flex>
						<DynamicForm
							fields={dynamicFields}
							control={form.control}
							errors={form.formState.errors}
							isValid={form.formState.isValid}
							loading={false}
							buttonLabel='Salvar'
							onSubmit={() => undefined}
							handleSubmitFn={form.handleSubmit}
							generalError={manualErrorMode ? 'Existem campos que precisam de revisão.' : undefined}
						/>
					</Stack>
				</ComponentCard>
			</Stack>

			<Stack gap={{ base: 3, md: 4 }}>
				<SectionTitle
					title='Botões e inputs nativos'
					description='Apoio visual para comparar os wrappers com os controles base e conferir o comportamento em estado puro.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}>
					<ComponentCard
						title='FormButton'
						description='Botão de submit do sistema com estado válido e inválido.'
					>
						<FormButton isValid={!manualErrorMode} loading={false}>
							Salvar formulário
						</FormButton>
					</ComponentCard>
					<ComponentCard
						title='Controles nativos'
						description='Campos puros ao redor dos wrappers.'
					>
						<Stack gap={3}>
							<Input placeholder='Nome' defaultValue='Exemplo de nome' />
							<Textarea
								placeholder='Mensagem'
								defaultValue='Texto de exemplo para revisão visual.'
							/>
							<Input placeholder='Slug' defaultValue='hello-poetry' isDisabled />
							<BaseButton variant='outline'>BaseButton</BaseButton>
						</Stack>
					</ComponentCard>
				</Grid>
			</Stack>
		</Flex>
	);
}
