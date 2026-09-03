import { Link, Text, VStack } from '@chakra-ui/react';

type Link = { label: string; href: string };

const links: Link[] = [
	{ label: 'Repository', href: 'https://github.com/samuel-lab-prog' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/samuel-gomes-149251342/' },
	{ label: 'Instagram', href: 'https://instagram.com/samuelgomes9930' },
];

export function FooterCommunity() {
	return (
		<VStack align='start' gap={2}>
			<Text fontSize='0.875rem' lineHeight='1.4rem' color={'fg.muted'}>
				Development
			</Text>
			{links.map((link) => (
				<Link
					key={link.label}
					href={link.href}
					target='_blank'
					rel='noopener noreferrer'
					fontSize='0.8125rem'
					lineHeight='1.25rem'
					color={'fg.muted'}
					opacity='0.9'
					_hover={{ color: 'fg.default', opacity: 1 }}
				>
					{link.label}
				</Link>
			))}
		</VStack>
	);
}
