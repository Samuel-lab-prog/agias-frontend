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
import { useForm, type Field } from 'react-hook-form';

type DevFormValues = {
	title: string;
	description: string;
	category: string;
	tags: string[];
	cover: File | null;
	audio: File | null;
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

export function DevComponentsPage() {
	const [query, setQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');

	const form = useForm<DevFormValues>({
		mode: 'onChange',
		defaultValues: {
			title: 'Hello Poetry',
			description: 'Texto de exemplo para revisão visual.',
			category: 'article',
			tags: ['design', 'ui'],
			cover: null,
			audio: null,
		},
	});

	const dynamicFields = useMemo<Field<DevFormValues>[]>(
		() => [
			{ kind: 'input', name: 'title', label: 'Título', required: true, maxLength: 80 },
			{
				kind: 'input',
				name: 'description',
				label: 'Descrição',
				type: 'textarea',
				rows: 4,
				maxLength: 240,
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
			{ kind: 'tags', name: 'tags', label: 'Tags', placeholder: 'Digite e enter' },
			{ kind: 'file', name: 'cover', label: 'Capa', preview: 'image' },
			{ kind: 'audio', name: 'audio', label: 'Áudio' },
		],
		[],
	);

	return (
		<Flex as='main' layerStyle='mainPadded' direction='column' gap={{ base: 6, md: 8 }} pb={12}>
			<Stack gap={{ base: 3, md: 4 }}>
				<SectionTitle
					title='Campos básicos'
					description='Os blocos mais simples para revisar labels, erro, foco e espaçamento.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}>
					<ComponentCard title='FormField' description='Input e textarea com validação e contador.'>
						<Stack gap={3}>
							<FormField
								control={form.control}
								name='title'
								label='Título'
								required
								maxLength={80}
								showCharacterCount
							/>
							<FormField
								control={form.control}
								name='description'
								label='Descrição'
								as='textarea'
								rows={4}
								maxLength={240}
								showCharacterCount
							/>
						</Stack>
					</ComponentCard>
					<ComponentCard title='SelectField' description='Select nativo com placeholder e estado visual.'>
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
						/>
					</ComponentCard>
				</Grid>
			</Stack>

			<Stack gap={{ base: 3, md: 4 }}>
				<SectionTitle
					title='Campos especiais'
					description='Os componentes mais personalizados do core para upload, áudio e tags.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', xl: 'repeat(2, minmax(0, 1fr))' }}>
					<ComponentCard title='TagsField' description='Tags com limite, dedupe e sanitização.'>
						<TagsField control={form.control} name='tags' label='Tags' placeholder='Digite e enter' />
					</ComponentCard>
					<ComponentCard title='FileField' description='Upload com preview e mensagem auxiliar.'>
						<FileField
							control={form.control}
							name='cover'
							label='Capa'
							buttonLabel='Selecionar arquivo'
							helpText='Use uma imagem para testar o preview.'
							preview='image'
						/>
					</ComponentCard>
					<ComponentCard title='AudioField' description='Upload e gravação de áudio.'>
						<AudioField control={form.control} name='audio' label='Áudio' />
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
					description='O formulário completo montado a partir dos descriptors do core.'
				/>
				<ComponentCard title='Exemplo completo' description='DynamicForm com todos os tipos de campo.'>
					<DynamicForm
						fields={dynamicFields}
						control={form.control}
						errors={form.formState.errors}
						isValid={form.formState.isValid}
						loading={false}
						buttonLabel='Salvar'
						onSubmit={() => undefined}
						handleSubmitFn={form.handleSubmit}
					/>
				</ComponentCard>
			</Stack>

			<Stack gap={{ base: 3, md: 4 }}>
				<SectionTitle
					title='Botões e inputs nativos'
					description='Apoio visual para comparar os wrappers com os controles base.'
				/>
				<Grid gap={4} gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}>
					<ComponentCard title='FormButton' description='Botão de submit do sistema.'>
						<FormButton isValid loading={false}>
							Salvar formulário
						</FormButton>
					</ComponentCard>
					<ComponentCard title='Controles nativos' description='Campos puros ao redor dos wrappers.'>
						<Stack gap={3}>
							<Input placeholder='Nome' defaultValue='Exemplo de nome' />
							<Textarea placeholder='Mensagem' defaultValue='Texto de exemplo para revisão visual.' />
							<BaseButton variant='outline'>BaseButton</BaseButton>
						</Stack>
					</ComponentCard>
				</Grid>
			</Stack>
		</Flex>
	);
}
