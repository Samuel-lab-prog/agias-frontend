import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import {
	getAccessDeniedMessage,
	getBannedPrivilegeMessage,
	getSuspendedPrivilegeMessage,
	useAuthClientStore,
} from '@features/auth/public';
import { eventBus } from '@root/core/events/eventBus';
import { useEffect } from 'react';
import { isRouteErrorResponse, NavLink, useLocation, useRouteError } from 'react-router-dom';

type ErrorInfo = {
	status?: number;
	code?: string;
	message: string;
	description: string;
	recoveryTo: string;
	recoveryLabel: string;
};

type RouteErrorTelemetry = {
	kind: 'route_error_page';
	path: string;
	status?: number;
	code?: string;
	message: string;
	description: string;
	timestamp: string;
	rawError?: unknown;
};

function isLikelyExpiredSessionValidationError({
	status,
	code,
	message,
}: {
	status?: number;
	code?: string;
	message?: string;
}) {
	if (status !== 422) return false;
	if (code !== 'VALIDATION') return false;
	if (!message) return false;
	return message.toLowerCase().includes('validation failed');
}

function sendErrorTelemetry(payload: RouteErrorTelemetry) {
	console.error('[route-error]', payload);

	const endpoint = import.meta.env.VITE_ERROR_TELEMETRY_URL;
	if (!endpoint) return;

	try {
		const body = JSON.stringify(payload);

		if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
			const blob = new Blob([body], { type: 'application/json' });
			navigator.sendBeacon(endpoint, blob);
			return;
		}

		void fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body,
			keepalive: true,
		});
	} catch {
		// Never break the UI due to telemetry transport errors.
	}
}

function getErrorInfo(error: unknown): ErrorInfo {
	if (isRouteErrorResponse(error)) {
		const routeData = error.data as { code?: string; message?: string } | undefined;
		const routeCode = routeData?.code;
		const routeMessage = routeData?.message;

		if (error.status === 401) {
			if (routeMessage?.toLowerCase().includes('banned')) {
				return {
					status: 401,
					code: routeCode,
					message: getBannedPrivilegeMessage(),
					description:
						'Use uma conta diferente ou entre em contato com o suporte se isso parecer incorreto.',
					recoveryTo: '/login',
					recoveryLabel: 'Ir para o login',
				};
			}

			return {
				status: 401,
				message: 'Sua sessão expirou.',
				description: 'Entre novamente para continuar.',
				recoveryTo: '/login',
				recoveryLabel: 'Entrar novamente',
			};
		}

		if (
			isLikelyExpiredSessionValidationError({
				status: error.status,
				code: routeCode,
				message: routeMessage,
			})
		) {
			return {
				status: 401,
				code: routeCode,
				message: 'Sua sessão expirou.',
				description: 'Entre novamente para continuar.',
				recoveryTo: '/login',
				recoveryLabel: 'Entrar novamente',
			};
		}

		if (error.status === 403) {
			return {
				status: 403,
				message: getAccessDeniedMessage({
					fallback: 'Você não tem permissão para acessar esta página.',
					bannedMessage: getBannedPrivilegeMessage(),
					suspendedMessage: getSuspendedPrivilegeMessage(),
				}),
				description: getAccessDeniedMessage({
					fallback: 'Tente com outra conta ou volte para a página inicial.',
					bannedMessage:
						'Esta conta não pode usar áreas autenticadas. Use outra conta ou entre em contato com o suporte se isso parecer incorreto.',
					suspendedMessage:
						'Você ainda pode usar áreas disponíveis, como notificações, enquanto os privilégios restritos permanecem indisponíveis.',
				}),
				recoveryTo: '/',
				recoveryLabel: 'Ir para a página inicial',
			};
		}

		if (error.status === 404) {
			return {
				status: 404,
				message: 'Esta página não existe.',
				description: 'Verifique a URL ou volte para a página inicial.',
				recoveryTo: '/',
				recoveryLabel: 'Ir para a página inicial',
			};
		}

		return {
			status: error.status,
			message: 'Não foi possível carregar esta página.',
			description: 'Tente novamente em instantes.',
			recoveryTo: '/',
			recoveryLabel: 'Ir para a página inicial',
		};
	}

	if (error && typeof error === 'object') {
		const maybeError = error as { statusCode?: number; code?: string; message?: string };
		const status = maybeError.statusCode;

		if (status === 401) {
			if (maybeError.message?.toLowerCase().includes('banned')) {
			return {
				status: 401,
				code: maybeError.code,
				message: getBannedPrivilegeMessage(),
				description:
					'Use uma conta diferente ou entre em contato com o suporte se isso parecer incorreto.',
				recoveryTo: '/login',
				recoveryLabel: 'Ir para o login',
			};
			}

			return {
				status: 401,
				code: maybeError.code,
				message: 'Sua sessão expirou.',
				description: 'Entre novamente para continuar.',
				recoveryTo: '/login',
				recoveryLabel: 'Entrar novamente',
			};
		}

		if (
			isLikelyExpiredSessionValidationError({
				status,
				code: maybeError.code,
				message: maybeError.message,
			})
		) {
			return {
				status: 401,
				code: maybeError.code,
				message: 'Sua sessão expirou.',
				description: 'Entre novamente para continuar.',
				recoveryTo: '/login',
				recoveryLabel: 'Entrar novamente',
			};
		}

		if (status === 403) {
			return {
				status: 403,
				code: maybeError.code,
				message: getAccessDeniedMessage({
					fallback: 'Acesso negado para esta ação.',
					bannedMessage: getBannedPrivilegeMessage(),
					suspendedMessage: getSuspendedPrivilegeMessage(),
				}),
				description: getAccessDeniedMessage({
					fallback: 'Tente novamente com outra conta.',
					bannedMessage:
						'Esta conta não pode usar áreas autenticadas. Use outra conta ou entre em contato com o suporte se isso parecer incorreto.',
					suspendedMessage:
						'Você ainda pode usar áreas disponíveis, como notificações, enquanto os privilégios restritos permanecem indisponíveis.',
				}),
				recoveryTo: '/',
				recoveryLabel: 'Ir para a página inicial',
			};
		}

		if (typeof maybeError.message === 'string' && maybeError.message.length > 0) {
			return {
				status,
				code: maybeError.code,
				message: 'Algo deu errado.',
				description: maybeError.message,
				recoveryTo: '/',
				recoveryLabel: 'Ir para a página inicial',
			};
		}
	}

	return {
		message: 'Algo deu errado ou esta página não existe.',
		description: 'Tente voltar para a página inicial ou verificar a URL.',
		recoveryTo: '/',
		recoveryLabel: 'Voltar para a página inicial',
	};
}

export function ErrorPage() {
	const error = useRouteError();
	const location = useLocation();
	const clearAuthClient = useAuthClientStore((state) => state.clearAuthClient);
	const info = getErrorInfo(error);
	const shouldClearSession = info.status === 401;

	useEffect(() => {
		sendErrorTelemetry({
			kind: 'route_error_page',
			path: location.pathname,
			status: info.status,
			code: info.code,
			message: info.message,
			description: info.description,
			timestamp: new Date().toISOString(),
			rawError: error,
		});
	}, [error, info.code, info.description, info.message, info.status, location.pathname]);

	return (
		<Flex minH='100vh' align='center' justify='center' px={6} py={20} textAlign='center'>
			<Box maxW='md'>
				<Heading as='h1' textStyle='h2'>
					Ops!
				</Heading>

				<Heading as='h2' textStyle='h5' mt={3}>
					{info.message}
				</Heading>

				<Text textStyle='small' mt={1}>
					{info.description}
				</Text>

				{info.status && (
					<Text textStyle='smaller' mt={2} color='pink.200'>
					Erro {info.status}
						{info.code ? ` (${info.code})` : ''}
					</Text>
				)}

				<Box mt={6}>
					<Button asChild variant='solidPink'>
						<NavLink
							to={info.recoveryTo}
							onClick={() => {
								if (!shouldClearSession) return;
								const userId = useAuthClientStore.getState().authClient?.id ?? null;
								clearAuthClient();
								void eventBus.publish('userLoggedOut', {
									userId,
									reason: 'sessionExpired',
									loggedOutAt: new Date().toISOString(),
								});
							}}
						>
							{info.recoveryLabel}
						</NavLink>
					</Button>
				</Box>
			</Box>
		</Flex>
	);
}
