import { Toaster } from '@BaseComponents';
import { ErrorPage } from '@BasePages';
import { Flex, Spinner } from '@chakra-ui/react';
import { type ComponentType, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

function lazyPage<TModule extends object>(
	load: () => Promise<TModule>,
	select: (module: TModule) => ComponentType,
) {
	return lazy(async () => ({ default: select(await load()) }));
}

function PageLoader() {
	return (
		<Flex as='main' layerStyle='mainPadded' direction='column' align='center' minH='32vh' justify='center'>
			<Spinner size='lg' color='pink.300' />
		</Flex>
	);
}

function renderLazyPage(Component: ComponentType) {
	return (
		<Suspense fallback={<PageLoader />}>
			<Component />
		</Suspense>
	);
}

const LoginPage = lazyPage(() => import('./features/auth/use-cases/login/Page'), (module) => module.LoginPage);

const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to='/login' replace />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/login',
		element: renderLazyPage(LoginPage),
		errorElement: <ErrorPage />,
	},
]);

export default function App() {
	return (
		<>
			<RouterProvider router={router} />
			<Toaster />
		</>
	);
}
