import { Combobox, createListCollection, Portal } from '@chakra-ui/react';
import { useMemo } from 'react';

export function TextSearchCombobox({
	value,
	onChange,
	label,
	placeholder,
	options,
	emptyText,
	clearLabel,
	triggerLabel,
}: {
	value: string;
	onChange: (value: string) => void;
	label: string;
	placeholder: string;
	options: { value: string; label: string }[];
	emptyText: string;
	clearLabel: string;
	triggerLabel: string;
}) {
	const collection = useMemo(
		() =>
			createListCollection({
				items: options,
				itemToValue: (item) => item.value,
				itemToString: (item) => item.label,
			}),
		[options],
	);
	return (
		<Combobox.Root
			collection={collection}
			inputValue={value}
			value={value ? [value] : []}
			onInputValueChange={(details) => onChange(details.inputValue)}
			onValueChange={(details) => onChange(details.value[0] ?? '')}
			allowCustomValue
			openOnClick
			closeOnSelect
			selectionBehavior='preserve'
			positioning={{ sameWidth: true }}
			w='full'
		>
			<Combobox.Label fontSize='sm' fontWeight='semibold' color='fg.default' mb={1.5}>
				{label}
			</Combobox.Label>
			<Combobox.Control position='relative'>
				<Combobox.Input
					placeholder={placeholder}
					maxLength={100}
					autoComplete='off'
					w='full'
					minH='44px'
					bg='bg.canvas'
					color='fg.default'
					border='1px solid'
					borderColor='border.default'
					borderRadius='md'
					px={3}
					pe={16}
					fontSize='sm'
					_placeholder={{ color: 'fg.muted' }}
					_focusVisible={{ outline: '2px solid', outlineColor: 'focus.ring' }}
				/>
				<Combobox.IndicatorGroup position='absolute' right={2} top={0} h='full' color='fg.muted'>
					<Combobox.ClearTrigger aria-label={clearLabel} />
					<Combobox.Trigger aria-label={triggerLabel} />
				</Combobox.IndicatorGroup>
			</Combobox.Control>
			<Portal>
				<Combobox.Positioner zIndex={20}>
					<Combobox.Content
						maxH='280px'
						overflowY='auto'
						p={1.5}
						bg='bg.surface'
						color='fg.default'
						border='1px solid'
						borderColor='border.surface'
						borderRadius='lg'
						boxShadow='floating'
					>
						<Combobox.Empty px={3} py={3} color='fg.muted' fontSize='sm' role='status'>
							{emptyText}
						</Combobox.Empty>
						{collection.items.map((item) => (
							<Combobox.Item
								key={item.value}
								item={item}
								px={3}
								py={2.5}
								borderRadius='md'
								fontSize='sm'
								cursor='pointer'
								_highlighted={{ bg: 'action.primarySubtle', color: 'action.primaryStrong' }}
							>
								<Combobox.ItemText>{item.label}</Combobox.ItemText>
								<Combobox.ItemIndicator />
							</Combobox.Item>
						))}
					</Combobox.Content>
				</Combobox.Positioner>
			</Portal>
		</Combobox.Root>
	);
}
