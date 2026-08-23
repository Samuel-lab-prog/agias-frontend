import { ErrorStateCard } from '@BaseComponents';
import { type BoxProps, Button, HStack, Icon, Text } from '@chakra-ui/react';
import { LogIn } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type AuthRequiredCardProps = Omit<BoxProps, 'title'> & {
	eyebrow?: string;
	title: string;
	description: string;
	showCreateAccount?: boolean;
};

export function AuthRequiredCard({
	eyebrow = 'ENTRADA OBRIGATÓRIA',
	title,
	description,
	showCreateAccount = false,
	...boxProps
}: AuthRequiredCardProps) {
	return (
		<ErrorStateCard
			eyebrow={eyebrow}
			title={title}
			description={description}
			action={
				<HStack gap={3} wrap='wrap' w='full'>
					<Button size='sm' variant='solidPink' w={{ base: 'full', md: 'auto' }} asChild>
						<NavLink to='/login'>
							<HStack gap={2}>
								<Icon as={LogIn} boxSize={3.5} />
								<Text as='span'>Entrar</Text>
							</HStack>
						</NavLink>
					</Button>
				</HStack>
			}
			{...boxProps}
		/>
	);
}
