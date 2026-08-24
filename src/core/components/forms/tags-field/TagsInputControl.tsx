import { Field, TagsInput } from '@chakra-ui/react';
import { useState } from 'react';

type TagsInputControlProps = {
	selectedTags: string[];
	disabled?: boolean;
	hasError: boolean;
	maxTags: number;
	maxTagLength?: number;
	placeholder?: string;
	onValueChange: (value: string[]) => void;
};

/**
 * Chakra tags input wrapper with custom styling and local UX rules.
 * Handles dedupe, limits, and commits on blur.
 */
export function TagsInputControl({
	selectedTags,
	disabled,
	hasError,
	maxTags,
	maxTagLength,
	placeholder,
	onValueChange,
}: TagsInputControlProps) {
	const [isFocused, setIsFocused] = useState(false);
	const tagsCount = selectedTags.length;
	const limitReached = tagsCount >= maxTags;
	const tagSet = new Set(selectedTags.map((tag) => tag.toLowerCase()));

	const commitInputValue = (value: string, clear?: () => void) => {
		const trimmed = value.trim();
		if (!trimmed) return;
		if (limitReached) return;
		if (tagSet.has(trimmed.toLowerCase())) return;

		onValueChange([...selectedTags, trimmed]);
		clear?.();
	};

	return (
		<>
			<TagsInput.Root
				w='full'
				colorPalette='gray'
				animationName='fade-in'
				animationDuration='260ms'
				animationTimingFunction='ease-out'
				value={selectedTags}
				disabled={disabled}
				css={{
					"& [data-scope='tags-input'][data-part='item']": {
						background: 'rgba(0, 0, 0, 0.08) !important',
						color: 'var(--chakra-colors-gray-900) !important',
						borderColor: 'var(--chakra-colors-gray-400) !important',
					},
					"& [data-scope='tags-input'][data-part='itemPreview']": {
						background: 'transparent !important',
						color: 'var(--chakra-colors-gray-900) !important',
					},
				}}
				onValueChange={(details) => onValueChange(details.value)}
			>
				<TagsInput.Control
					bg='rgba(255, 255, 255, 0.03)'
					color='text'
					border='1px solid'
					borderColor={hasError ? 'error' : isFocused ? 'borderHover' : 'border'}
					borderRadius='md'
					px={2}
					textStyle='smaller'
					py={2}
					minH='42px'
					transition='all 0.22s ease'
					_hover={{
						borderColor: hasError ? 'error' : 'borderHover',
						bg: 'rgba(255, 255, 255, 0.03)',
					}}
					_focusWithin={{
						borderColor: hasError ? 'error' : 'borderHover',
						boxShadow: hasError
							? '0 0 0 5px rgba(239, 68, 68, 0.25)'
							: '0 0 0 5px rgba(0, 0, 0, 0.18)',
						bg: 'rgba(255, 255, 255, 0.04)',
					}}
				>
					<TagsInput.Items>
						{selectedTags.map((tag: string, index: number) => (
							<TagsInput.Item
								key={index}
								index={index}
								value={tag}
								bg='rgba(0, 0, 0, 0.08)'
								color='gray.900'
								border='1px solid'
								borderColor='gray.400'
								borderRadius='full'
								animationName='fade-in'
								animationDuration='180ms'
								_highlighted={{
									bg: 'rgba(0, 0, 0, 0.14)',
									color: 'gray.900',
								}}
								_selected={{
									bg: 'rgba(0, 0, 0, 0.14)',
									color: 'gray.900',
								}}
							>
								<TagsInput.ItemPreview
									bg='transparent'
									color='gray.900'
									_highlighted={{
										color: 'gray.900',
									}}
								>
									<TagsInput.ItemText color='gray.900'>{tag}</TagsInput.ItemText>
									<TagsInput.ItemDeleteTrigger color='gray.600' _hover={{ color: 'gray.900' }} />
								</TagsInput.ItemPreview>
								<TagsInput.ItemInput bg='transparent' color='gray.900' />
							</TagsInput.Item>
						))}
					</TagsInput.Items>

					<TagsInput.Input
						placeholder={
							limitReached ? 'Limite de tags atingido' : (placeholder ?? 'Adicione uma tag')
						}
						bg='transparent'
						color='text'
						disabled={disabled || limitReached}
						maxLength={maxTagLength}
						_placeholder={{ color: 'gray.500' }}
						onFocus={() => setIsFocused(true)}
						onBlur={(event) => {
							setIsFocused(false);
							if (disabled) return;
							commitInputValue(event.currentTarget.value, () => {
								event.currentTarget.value = '';
							});
						}}
					/>
					<TagsInput.ClearTrigger
						color='gray.500'
						transition='color 0.2s ease'
						_hover={{ color: 'gray.900' }}
					/>
				</TagsInput.Control>
			</TagsInput.Root>

			<Field.HelperText textStyle='smaller' color='textMuted' mt={1}>
				{tagsCount}/{maxTags} tags
			</Field.HelperText>
		</>
	);
}
