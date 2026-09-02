import { Flex } from '@chakra-ui/react';
import { AuthRequiredCard } from '@features/auth/public';

export function StaffProfileAccessGate() {
	return (
		<Flex
			as='main'
			bg='#f7f8fa'
			color='#0f172a'
			minH='100dvh'
			px={{ base: 4, md: 6 }}
			py={{ base: 6, md: 10 }}
			justify='center'
			align='center'
		>
			<AuthRequiredCard
				title='Acesso ao perfil de staff'
				description='Entre com uma conta autenticada para visualizar o perfil de staff.'
			/>
		</Flex>
	);
}
