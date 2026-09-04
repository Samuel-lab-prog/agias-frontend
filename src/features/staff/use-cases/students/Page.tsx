import { users } from '@Api/users/endpoints';
import type { CreateUserBody } from '@Api/users/types';
import { BaseButton, DynamicForm, type Field,FileField, Surface, toaster } from '@BaseComponents';
import { Box, Heading, SimpleGrid, Text, Textarea, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { z } from 'zod';

import { staffNavigationPreset } from '../home/navigation';

type StudentRow = Pick<CreateUserBody, 'name' | 'nickname' | 'email' | 'rg' | 'cpf'>;
type StudentsForm = StudentRow & { spreadsheet: File | null };

const studentSchema = z.object({
	name: z.string().trim().min(3, 'Informe o nome completo.'),
	nickname: z
		.string()
		.trim()
		.min(3, 'O usuário deve ter pelo menos 3 caracteres.')
		.regex(/^[a-zA-Z0-9_.]+$/, 'Use apenas letras, números, ponto ou sublinhado.'),
	email: z.string().trim().email('Informe um e-mail válido.'),
	rg: z
		.string()
		.trim()
		.regex(/^\d{5,20}$/, 'O RG deve conter entre 5 e 20 dígitos.'),
	cpf: z
		.string()
		.trim()
		.refine((value) => {
			const digits = value.replace(/\D/g, '');
			if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
			const calculate = (length: number) => {
				let sum = 0;
				for (let index = 0; index < length; index += 1)
					sum += Number(digits[index]) * (length + 1 - index);
				const remainder = (sum * 10) % 11;
				return remainder === 10 ? 0 : remainder;
			};
			return calculate(9) === Number(digits[9]) && calculate(10) === Number(digits[10]);
		}, 'Informe um CPF válido.'),
	spreadsheet: z.custom<File | null>().nullable(),
});

const individualFields: Field<StudentsForm>[] = [
	{ name: 'name', label: 'Nome completo', required: true, minLength: 3 },
	{
		name: 'nickname',
		label: 'Usuário',
		required: true,
		minLength: 3,
		transformValue: (value: string) => value.trim().toLowerCase(),
	},
	{ name: 'email', label: 'E-mail', required: true, type: 'text' },
	{
		name: 'rg',
		label: 'RG',
		required: true,
		transformValue: (value: string) => value.replace(/\D/g, '').slice(0, 20),
	},
	{
		name: 'cpf',
		label: 'CPF',
		required: true,
		maxLength: 11,
		transformValue: (value: string) => value.replace(/\D/g, '').slice(0, 11),
	},
];

const emptyStudent: StudentRow = { name: '', nickname: '', email: '', rg: '', cpf: '' };

function parseRows(value: string): StudentRow[] {
	return value
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.filter((line) => !line.toLowerCase().startsWith('nome,'))
		.map((line) => {
			const [name = '', nickname = '', email = '', rg = '', cpf = ''] = line
				.split(',')
				.map((part) => part.trim());
			return { name, nickname, email, rg, cpf };
		});
}

function rowsToCsv(rows: StudentRow[]) {
	return rows
		.map((row) => [row.name, row.nickname, row.email, row.rg, row.cpf].join(', '))
		.join('\n');
}

export function StaffStudentsPage() {
	const form = useForm<StudentsForm>({
		defaultValues: { ...emptyStudent, spreadsheet: null },
		resolver: zodResolver(studentSchema),
		mode: 'onChange',
	});
	const [csv, setCsv] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const rows = parseRows(csv);

	const importSpreadsheet = async (file: File) => {
		try {
			const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
			const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
			if (!firstSheet) throw new Error('A planilha não possui uma aba válida.');
			const values = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, {
				header: 1,
				defval: '',
				raw: false,
			});
			const content = values
				.map((row) => row.slice(0, 5).map((cell) => String(cell).trim()))
				.filter((row) => row.some(Boolean));
			const hasHeader = content[0]?.[0]?.toLowerCase() === 'nome';
			const importedRows = (hasHeader ? content.slice(1) : content).map(
				([name = '', nickname = '', email = '', rg = '', cpf = '']) => ({
					name,
					nickname,
					email,
					rg,
					cpf,
				}),
			);
			setCsv(rowsToCsv(importedRows));
			toaster.create({
				title: 'Planilha carregada',
				description: `${importedRows.length} linha(s) pronta(s) para revisão.`,
				type: 'success',
			});
		} catch (error) {
			toaster.create({
				title: 'Não foi possível ler a planilha',
				description: error instanceof Error ? error.message : 'Use um arquivo XLSX ou XLS válido.',
				type: 'error',
			});
		}
	};

	const spreadsheet = form.watch('spreadsheet');
	useEffect(() => {
		if (spreadsheet) void importSpreadsheet(spreadsheet);
	}, [spreadsheet]);

	const createOne = async (data: StudentRow) => {
		await users.createUser.mutate({ ...data, avatarUrl: null, role: 'student' });
	};

	const submitOne = async (values: StudentsForm) => {
		setIsSaving(true);
		try {
			await createOne(values);
			form.reset({ ...emptyStudent, spreadsheet: null });
			toaster.create({
				title: 'Aluno cadastrado',
				description: 'A conta foi criada com status pendente.',
				type: 'success',
			});
		} catch (error) {
			toaster.create({
				title: 'Não foi possível cadastrar',
				description:
					error instanceof Error ? error.message : 'Verifique os dados e tente novamente.',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const submitBatch = async () => {
		if (!rows.length || rows.some((row) => Object.values(row).some((value) => !value))) {
			toaster.create({
				title: 'Arquivo inválido',
				description: 'Informe uma linha por aluno com nome, usuário, e-mail, RG e CPF.',
				type: 'error',
			});
			return;
		}
		setIsSaving(true);
		let created = 0;
		try {
			for (const row of rows) {
				// eslint-disable-next-line no-await-in-loop -- keep imports ordered and stop safely on the first invalid row.
				await createOne(row);
				created += 1;
			}
			setCsv('');
			toaster.create({
				title: 'Importação concluída',
				description: `${created} aluno(s) cadastrado(s) com sucesso.`,
				type: 'success',
			});
		} catch (error) {
			toaster.create({
				title: 'Importação interrompida',
				description: `${created} aluno(s) cadastrado(s). ${error instanceof Error ? error.message : 'Revise a próxima linha.'}`,
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<NavigationPageShell preset={staffNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<Box>
					<Heading fontSize='2xl'>Cadastrar alunos</Heading>
					<Text color='fg.muted'>
						Crie uma conta individualmente ou importe vários alunos de uma vez.
					</Text>
				</Box>
				<SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
					<Surface variant='panel'>
						<VStack align='stretch' gap={3}>
							<Box borderBottomWidth='1px' borderColor='border.default' pb={3}>
								<Heading fontSize='lg'>Cadastro individual</Heading>
								<Text fontSize='sm' color='fg.muted' mt={1}>
									A senha inicial será a matrícula gerada pelo sistema.
								</Text>
							</Box>
							<DynamicForm
								fields={individualFields}
								control={form.control}
								errors={form.formState.errors}
								isValid={form.formState.isValid}
								loading={isSaving}
								onSubmit={submitOne}
								handleSubmitFn={form.handleSubmit}
								buttonLabel='Cadastrar aluno'
							/>
						</VStack>
					</Surface>
					<Surface variant='panel'>
						<VStack align='stretch' gap={3}>
							<Box borderBottomWidth='1px' borderColor='border.default' pb={3}>
								<Heading fontSize='lg'>Importação em lote</Heading>
								<Text fontSize='sm' color='fg.muted' mt={1}>
									Cole CSV sem cabeçalho ou use: nome, usuário, e-mail, RG, CPF.
								</Text>
							</Box>
							<FileField
								control={form.control}
								name='spreadsheet'
								label='Importar arquivo Excel'
								buttonLabel='Escolher planilha'
								accept='.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
								helpText='Colunas na ordem: nome, usuário, e-mail, RG e CPF. Os dados serão preenchidos abaixo para conferência.'
							/>
							<Textarea
								value={csv}
								onChange={(event) => setCsv(event.target.value)}
								placeholder={
									'Ana Souza, ana.souza, ana@escola.com, 123456789, 12345678901\nBruno Lima, bruno.lima, bruno@escola.com, 987654321, 98765432100'
								}
								minH='220px'
							/>
							<Text fontSize='sm' color='fg.muted'>
								{rows.length} linha(s) reconhecida(s)
							</Text>
							<BaseButton onClick={() => void submitBatch()} disabled={isSaving}>
								Cadastrar alunos
							</BaseButton>
						</VStack>
					</Surface>
				</SimpleGrid>
			</VStack>
		</NavigationPageShell>
	);
}
