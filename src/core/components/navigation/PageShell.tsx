import { Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { NavigationSidebar } from './Sidebar';
import { NavigationTopBar } from './TopBar';
import type { NavigationPreset } from './types';

type NavigationPageShellProps = {
	preset: NavigationPreset;
	children: ReactNode;
	sidebarWidth?: string;
};

export function NavigationPageShell({
	preset,
	children,
	sidebarWidth = '260px',
}: NavigationPageShellProps) {
	return (
		<Flex as='main' layerStyle='main' minH='100%' direction='column'>
			<Flex
				position='sticky'
				top={0}
				zIndex={20}
				w='full'
				borderBottom='1px solid'
				borderColor='purple.500'
				bg='rgba(18, 0, 17, 0.92)'
				backdropFilter='blur(8px)'
			>
				<NavigationTopBar title={preset.title} subtitle={preset.subtitle} action={preset.action} />
			</Flex>

			<Flex layerStyle='main' gap={4} direction={{ base: 'column', xl: 'row' }} flex='1'>
				<Flex display={{ base: 'none', xl: 'block' }} flexShrink={0} w={sidebarWidth} >
					<NavigationSidebar links={preset.links} />
				</Flex>

				<Flex flex='1' minW={0} direction='column' gap={4} mt={4}>
					{children}
				</Flex>
			</Flex>
		</Flex>
	);
}
