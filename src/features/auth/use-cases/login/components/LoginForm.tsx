import { DynamicForm, type Field } from '@BaseComponents';

import { useLoginForm } from '../hooks/useLoginForm';
import type { LoginDataType } from '../schemas/loginSchema';

const loginFields: Field<LoginDataType>[] = [
	{
		name: 'cpf',
		label: 'CPF',
		required: true,
		autoFocus: true,
		maxLength: 11,
		transformValue: (value: string) => value.replace(/\D/g, '').slice(0, 11),
	},
	{ name: 'password', label: 'Senha', required: true, type: 'password' },
];

export function LoginForm() {
	const { control, formState, onSubmit, isPending, generalError, handleSubmit } = useLoginForm();

	return (
		<DynamicForm<LoginDataType>
			fields={loginFields}
			control={control}
			errors={formState.errors}
			isValid={formState.isValid}
			loading={isPending}
			generalError={generalError}
			onSubmit={onSubmit}
			handleSubmitFn={handleSubmit}
			buttonLabel='Entrar'
			buttonVariant='primary'
		/>
	);
}
