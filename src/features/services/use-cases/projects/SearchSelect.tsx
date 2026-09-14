import { Combobox, createListCollection, Portal, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { optionLabel, type SearchOption } from './search-options';

const normalize = (value: string) =>
	value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR');

export function SearchSelect({
	label,
	value,
	onChange,
	options,
	disabled = false,
	emptyText = 'Nenhuma opção cadastrada.',
	placeholder = 'Selecione ou digite para buscar',
}: {
	label: string;
	value?: number | null;
	onChange: (value: number | null) => void;
	options: SearchOption[];
	disabled?: boolean;
	emptyText?: string;
	placeholder?: string;
}) {
	const [search, setSearch] = useState('');
	const collection = useMemo(
		() =>
			createListCollection({
				items: options.filter(
					(item) => item.id === value || normalize(optionLabel(item)).includes(normalize(search)),
				),
				itemToString: optionLabel,
				itemToValue: (item) => String(item.id),
			}),
		[options, search, value],
	);
	return (
		<Combobox.Root
			collection={collection}
			value={value ? [String(value)] : []}
			onValueChange={(details) => onChange(details.value[0] ? Number(details.value[0]) : null)}
			onInputValueChange={(details) => setSearch(details.inputValue)}
			onOpenChange={(details) => {
				if (details.open) setSearch('');
			}}
			disabled={disabled}
			openOnClick
			closeOnSelect
			selectionBehavior='replace'
			position='relative'
			w='full'
		>
			<Combobox.Label fontSize='sm' fontWeight='semibold' color='fg.default' mb={1.5}>
				{label}
			</Combobox.Label>
			<Combobox.Control position='relative' w='full'>
				<Combobox.Input
					placeholder={placeholder}
					w='full'
					minH='44px'
					bg='bg.canvas'
					color='fg.default'
					border='1px solid'
					borderColor='border.default'
					borderRadius='md'
					px={3}
					pe={12}
					fontSize='sm'
					lineHeight='1.4'
					_placeholder={{ color: 'fg.muted' }}
					_hover={{ bg: 'bg.surface', borderColor: 'border.interactive' }}
					_focusVisible={{
						outline: '2px solid',
						outlineColor: 'focus.ring',
						outlineOffset: '1px',
						bg: 'bg.surface',
						borderColor: 'action.primary',
					}}
					_disabled={{ opacity: 0.65, cursor: 'not-allowed' }}
				/>
				<Combobox.IndicatorGroup
					position='absolute'
					right={1}
					top={0}
					h='full'
					alignItems='center'
					pe={1}
					color='fg.muted'
				>
					<Combobox.ClearTrigger
						aria-label={`Limpar ${label}`}
						borderRadius='sm'
						color='fg.muted'
						_hover={{ bg: 'action.primarySubtle', color: 'fg.default' }}
						_focusVisible={{ outline: '2px solid', outlineColor: 'focus.ring' }}
					/>
					<Combobox.Trigger
						aria-label={`Abrir ${label}`}
						borderRadius='sm'
						color='fg.muted'
						_hover={{ bg: 'action.primarySubtle', color: 'fg.default' }}
						_focusVisible={{ outline: '2px solid', outlineColor: 'focus.ring' }}
					/>
				</Combobox.IndicatorGroup>
			</Combobox.Control>
			<Portal>
				<Combobox.Positioner zIndex={20}>
					<Combobox.Content
						maxH='280px'
						w='full'
						p={1}
						bg='bg.surface'
						color='fg.default'
						border='1px solid'
						borderColor='border.surface'
						borderRadius='lg'
						boxShadow='floating'
						overflowY='auto'
					>
						<Combobox.Empty px={3} py={3} color='fg.muted' fontSize='sm'>
							Nenhuma opção encontrada.
						</Combobox.Empty>
						{collection.items.map((item) => (
							<Combobox.Item
								key={item.id}
								item={item}
								display='flex'
								alignItems='flex-start'
								justifyContent='space-between'
								gap={3}
								minH='40px'
								px={3}
								py={2}
								borderRadius='md'
								color='fg.default'
								fontSize='sm'
								lineHeight='1.4'
								textAlign='left'
								whiteSpace='normal'
								wordBreak='break-word'
								cursor='pointer'
								transition='background-color 180ms ease, color 180ms ease'
								_hover={{ bg: 'action.primarySubtle', color: 'action.primaryStrong' }}
								_highlighted={{ bg: 'action.primarySubtle', color: 'action.primaryStrong' }}
							>
								<Combobox.ItemText flex='1' minW={0} whiteSpace='normal'>
									{optionLabel(item)}
								</Combobox.ItemText>
								<Combobox.ItemIndicator color='action.primary' flexShrink={0} />
							</Combobox.Item>
						))}
					</Combobox.Content>
				</Combobox.Positioner>
			</Portal>
			{options.length === 0 && !disabled && (
				<Text fontSize='xs' color='fg.muted'>
					{emptyText}
				</Text>
			)}
		</Combobox.Root>
	);
}
