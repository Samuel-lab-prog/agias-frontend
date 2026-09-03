import { Link, Text, VStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

type FooterLink = { label: string; to: string };

export function FooterNav({ links }: { links: FooterLink[] }) {
	return (
		<VStack align='start' gap={2}>
			<Text fontSize='0.875rem' lineHeight='1.4rem' color={'fg.muted'}>
				Navegation
			</Text>
			{links.map((link) => (
				<Link
					asChild
					key={link.label}
					fontSize='0.8125rem'
					lineHeight='1.25rem'
					color={'fg.muted'}
					opacity='0.9'
					_currentPage={{ color: 'action.primary', fontWeight: '600' }}
					_hover={{ color: 'fg.default', opacity: 1 }}
				>
					<NavLink to={link.to}>{link.label}</NavLink>
				</Link>
			))}
		</VStack>
	);
}
