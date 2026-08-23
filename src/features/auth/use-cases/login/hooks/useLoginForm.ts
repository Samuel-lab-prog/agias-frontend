import { auth } from '@Api/auth/endpoints';
import { type AuthClient } from '@Api/auth/types';
import { eventBus } from '@core/events/eventBus';
import { getBannedPrivilegeMessage } from '@features/auth/public';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AppErrorType } from '@Utils';
import { useState } from 'react';
import { useForm, type UseFormClearErrors, type UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuthClientStore } from '../../../public/stores/useAuthClientStore';
import { type LoginDataType, loginSchema } from '../schemas/loginSchema';

const HOME_ROUTE = '/';
const INVALID_CREDENTIALS_MESSAGE = 'Credenciais incorretas';

type LoginErrorDisplay = { kind: 'field'; message: string } | { kind: 'general'; message: string };

export function useLoginForm() {
	const [generalError, setGeneralError] = useState('');
	const navigate = useNavigate();

	const form = useForm<LoginDataType>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
	});

	const loginMutation = useMutation({
		mutationFn: (data: LoginDataType) => auth.login.mutate(data) as Promise<AuthClient>,

		onSuccess: (client) => {
			useAuthClientStore.getState().setAuthClient({
				id: client.id,
				role: client.role,
				status: client.status,
			});

			eventBus.publish('userLoggedIn', {
				userId: client.id,
				role: client.role,
				status: client.status,
				loggedInAt: new Date().toISOString(),
			});
			navigate(HOME_ROUTE, { replace: true });
		},

		onError: (err: unknown) => {
			handleLoginError(err, form.setError, form.clearErrors, setGeneralError);
		},
	});

	function onSubmit(data: LoginDataType) {
		setGeneralError('');
		form.clearErrors(['cpf', 'password']);
		if (loginMutation.isPending) return;
		loginMutation.mutate(data);
	}

	return {
		onSubmit,
		generalError,
		handleSubmit: form.handleSubmit,
		reset: form.reset,
		formState: form.formState,
		control: form.control,
		watch: form.watch,
		isPending: loginMutation.isPending,
	};
}

function handleLoginError(
	err: unknown,
	setError: UseFormSetError<LoginDataType>,
	clearErrors: UseFormClearErrors<LoginDataType>,
	setGeneralError: (msg: string) => void,
) {
	const display = getLoginErrorDisplay(err);

	if (display.kind === 'field') {
		setError('cpf', {
			type: 'manual',
			message: display.message,
		});
		setError('password', {
			type: 'manual',
			message: display.message,
		});
		return;
	}

	clearErrors(['cpf', 'password']);
	setGeneralError(display.message);
}

function isBannedLoginMessage(message: string) {
	return message.includes('banned') || message.includes('banido') || message.includes('banida');
}

function getLoginErrorDisplay(err: unknown): LoginErrorDisplay {
	const error = err as Partial<AppErrorType>;
	const status = error?.statusCode;
	const rawMessage = typeof error?.message === 'string' ? error.message : '';
	const message = rawMessage.toLowerCase();

	if (status === 401) {
		if (message.includes('pending') || message.includes('approval')) {
			return {
				kind: 'general',
				message: 'Sua conta está pendente de aprovação. Aguarde o staff liberar o acesso.',
			};
		}

		if (isBannedLoginMessage(message)) {
			return { kind: 'general', message: getBannedPrivilegeMessage('sign in') };
		}

		if (message.includes('too many')) {
			return {
				kind: 'general',
				message: 'Muitas tentativas de login. Aguarde um momento e tente novamente.',
			};
		}

		if (!message || message.includes('invalid credentials')) {
			return { kind: 'field', message: INVALID_CREDENTIALS_MESSAGE };
		}

		return {
			kind: 'general',
			message: 'Não foi possível entrar. Tente novamente.',
		};
	}

	if (status === 403) {
		if (message.includes('not active') || message.includes('inactive')) {
			return { kind: 'general', message: 'Sua conta não está ativa.' };
		}

		return {
			kind: 'general',
			message: 'Você não tem permissão para entrar.',
		};
	}

	if (status === 422) {
		return {
			kind: 'general',
			message: 'Revise seus dados de acesso e tente novamente.',
		};
	}

	if (status === 429) {
		return {
			kind: 'general',
			message: 'Muitas tentativas. Tente novamente mais tarde.',
		};
	}

	return {
		kind: 'general',
		message: 'Não foi possível alcançar o servidor. Verifique sua conexão e tente novamente.',
	};
}
