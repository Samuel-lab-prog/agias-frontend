import { Link, Text, VStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import { componentColors } from '../localStyles';

type FooterLink = { label: string; to: string };

export function FooterNav({ links }: { links: FooterLink[] }) {
	return (
		<VStack align='start' gap={2}>
			<Text fontSize='0.875rem' lineHeight='1.4rem' color={componentColors.dark.textMuted}>
				Navegation
			</Text>
			{links.map((link) => (
				<Link
					asChild
					key={link.label}
					fontSize='0.8125rem'
					lineHeight='1.25rem'
					color={componentColors.dark.textMuted}
					opacity='0.9'
					_currentPage={{ color: componentColors.dark.accent, fontWeight: '600' }}
					_hover={{ color: componentColors.dark.text, opacity: 1 }}
				>
					<NavLink to={link.to}>{link.label}</NavLink>
				</Link>
			))}
		</VStack>
	);
}
