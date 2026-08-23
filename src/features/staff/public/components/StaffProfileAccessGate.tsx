import { Flex } from '@chakra-ui/react';
import { AuthRequiredCard } from '@features/auth/public';

export function StaffProfileAccessGate() {
	return (
		<Flex as='main' layerStyle='mainPadded' justify='center' align='center' minH='100vh'>
			<AuthRequiredCard
				title='Acesso ao perfil de staff'
				description='Entre com uma conta autenticada para visualizar o perfil de staff.'
			/>
		</Flex>
	);
}
