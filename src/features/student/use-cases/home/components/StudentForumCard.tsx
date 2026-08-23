import { Surface } from '@BaseComponents';
import { Box, Button, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { GraduationCap } from 'lucide-react';

export function StudentForumCard() {
	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }}>
			<Heading as='h3' textStyle='h6' mb={4}>
				Fórum de cursos
			</Heading>

			<Flex align='center' gap={4} wrap='wrap'>
				<Box boxSize={14} borderRadius='full' bg='rgba(255,255,255,0.06)' display='grid' placeItems='center'>
					<GraduationCap size={28} />
				</Box>
				<Box flex='1'>
					<Text textStyle='smaller' color='pink.100'>
						Esse fórum é destinado para discussões relacionadas ao seu curso. Todos os alunos do curso e a coordenação têm acesso a ele.
					</Text>
				</Box>
			</Flex>

			<HStack gap={3} mt={4} wrap='wrap'>
				<Button variant='solidPink'>Cadastrar novo tópico</Button>
				<Button variant='outline' color='pink.100' borderColor='border'>
					Visualizar todos os tópicos
				</Button>
			</HStack>

			<Text textStyle='smaller' color='pink.100' mt={4}>
				Nenhum item foi encontrado
			</Text>
		</Surface>
	);
}
