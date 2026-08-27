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
				colorPalette='blue'
				animationName='fade-in'
				animationDuration='260ms'
				animationTimingFunction='ease-out'
				value={selectedTags}
				disabled={disabled}
				css={{
					"& [data-scope='tags-input'][data-part='item']": {
						background: 'var(--chakra-colors-accentSoft) !important',
						color: 'var(--chakra-colors-accentStrong) !important',
						borderColor: 'var(--chakra-colors-borderHover) !important',
					},
					"& [data-scope='tags-input'][data-part='itemPreview']": {
						background: 'transparent !important',
						color: 'var(--chakra-colors-accentStrong) !important',
					},
					"& [data-scope='tags-input'][data-part='itemText']": {
						color: 'var(--chakra-colors-accentStrong) !important',
					},
					"& [data-scope='tags-input'][data-part='itemDeleteTrigger']": {
						color: 'var(--chakra-colors-accent) !important',
					},
					"& [data-scope='tags-input'][data-part='itemDeleteTrigger']:hover": {
						color: 'var(--chakra-colors-text) !important',
					},
					"& [data-scope='tags-input'][data-part='input']": {
						color: 'var(--chakra-colors-text) !important',
					},
					"& [data-scope='tags-input'][data-part='clearTrigger']": {
						color: 'var(--chakra-colors-textMuted) !important',
					},
				}}
				onValueChange={(details) => onValueChange(details.value)}
			>
				<TagsInput.Control
					bg='background'
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
						bg: 'surface',
					}}
					_focusWithin={{
						borderColor: hasError ? 'error' : 'borderHover',
						boxShadow: hasError ? '0 0 0 5px {colors.error}' : '0 0 0 5px {colors.focusRing}',
						bg: 'surface',
					}}
				>
					<TagsInput.Items>
						{selectedTags.map((tag: string, index: number) => (
							<TagsInput.Item
								key={index}
								index={index}
								value={tag}
								bg='accentSoft'
								color='accentStrong'
								border='1px solid'
								borderColor='borderHover'
								borderRadius='full'
								animationName='fade-in'
								animationDuration='180ms'
								_highlighted={{
									bg: 'surface',
									color: 'accentStrong',
								}}
								_selected={{
									bg: 'surface',
									color: 'accentStrong',
								}}
							>
								<TagsInput.ItemPreview
									bg='transparent'
									color='accentStrong'
									_highlighted={{
										color: 'accentStrong',
									}}
								>
									<TagsInput.ItemText color='accentStrong'>{tag}</TagsInput.ItemText>
									<TagsInput.ItemDeleteTrigger color='accent' _hover={{ color: 'accentStrong' }} />
								</TagsInput.ItemPreview>
								<TagsInput.ItemInput bg='transparent' color='accentStrong' />
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
						_placeholder={{ color: 'textMuted' }}
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
						color='textMuted'
						transition='color 0.2s ease'
						_hover={{ color: 'text' }}
					/>
				</TagsInput.Control>
			</TagsInput.Root>

			<Field.HelperText textStyle='smaller' color='textMuted' mt={1}>
				{tagsCount}/{maxTags} tags
			</Field.HelperText>
		</>
	);
}
