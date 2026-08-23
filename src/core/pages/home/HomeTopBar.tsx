import { Surface } from '@BaseComponents';
import { Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function HomeTopBar() {
	return (
		<Surface variant='panel' p={{ base: 3.5, md: 4 }} w='full' borderRadius={0}>
			<Flex align='center' justify='space-between' gap={3} wrap='wrap'>
				<Heading as='h1' textStyle='h6'>
					AGIAS
				</Heading>

				<Flex align='center' gap={3}>
					<NavLink to='/login'>
						<HStack
							px={3}
							py={2}
							borderRadius='full'
							border='1px solid'
							borderColor='border'
							_hover={{ bg: 'rgba(255,255,255,0.05)' }}
						>
							<LogOut size={18} />
							<Text textStyle='xs'>Sair</Text>
						</HStack>
					</NavLink>
				</Flex>
			</Flex>
		</Surface>
	);
}
