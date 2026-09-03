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
				animationName='fade-in'
				animationDuration='260ms'
				animationTimingFunction='ease-out'
				value={selectedTags}
				disabled={disabled}
				css={{
					"& [data-scope='tags-input'][data-part='item']": {
						background: `${'action.primarySubtle'} !important`,
						color: `${'action.primaryStrong'} !important`,
						borderColor: `${'border.interactive'} !important`,
					},
					"& [data-scope='tags-input'][data-part='itemPreview']": {
						background: 'transparent !important',
						color: `${'action.primaryStrong'} !important`,
					},
					"& [data-scope='tags-input'][data-part='itemText']": {
						color: `${'action.primaryStrong'} !important`,
					},
					"& [data-scope='tags-input'][data-part='itemDeleteTrigger']": {
						color: `${'action.primary'} !important`,
					},
					"& [data-scope='tags-input'][data-part='itemDeleteTrigger']:hover": {
						color: `${'fg.default'} !important`,
					},
					"& [data-scope='tags-input'][data-part='input']": {
						color: `${'fg.default'} !important`,
					},
					"& [data-scope='tags-input'][data-part='clearTrigger']": {
						color: `${'fg.muted'} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='item']": {
						background: `${'action.primarySubtle'} !important`,
						color: `${'action.primaryStrong'} !important`,
						borderColor: `${'border.interactive'} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='itemPreview']": {
						color: `${'action.primaryStrong'} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='itemText']": {
						color: `${'action.primaryStrong'} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='itemDeleteTrigger']": {
						color: `${'action.primary'} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='itemDeleteTrigger']:hover": {
						color: `${'fg.default'} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='input']": {
						color: `${'fg.default'} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='clearTrigger']": {
						color: `${'fg.muted'} !important`,
					},
				}}
				onValueChange={(details) => onValueChange(details.value)}
			>
				<TagsInput.Control
					bg='bg.canvas'
					color='fg.default'
					border='1px solid'
					borderColor={
						hasError ? 'status.error' : isFocused ? 'border.interactive' : 'border.default'
					}
					borderRadius='md'
					px='0.5rem'
					fontSize='0.8125rem'
					lineHeight='1.25rem'
					py='0.5rem'
					minH='42px'
					transition='all 0.22s ease'
					_hover={{
						borderColor: hasError ? 'status.error' : 'border.interactive',
						bg: 'bg.surface',
					}}
					_focusWithin={{
						borderColor: hasError ? 'status.error' : 'border.interactive',
						boxShadow: `0 0 0 5px ${hasError ? 'status.errorSubtle' : 'focus.ring'}`,
						bg: 'bg.surface',
					}}
					_dark={{
						bg: 'bg.canvas',
						color: 'fg.default',
						borderColor: hasError
							? 'status.error'
							: isFocused
								? 'border.interactive'
								: 'border.default',
						_hover: {
							borderColor: hasError ? 'status.error' : 'border.interactive',
							bg: 'bg.surface',
						},
						_focusWithin: {
							borderColor: hasError ? 'status.error' : 'border.interactive',
							boxShadow: `0 0 0 5px ${hasError ? 'status.errorSubtle' : 'focus.ring'}`,
							bg: 'bg.surface',
						},
					}}
				>
					<TagsInput.Items>
						{selectedTags.map((tag: string, index: number) => (
							<TagsInput.Item
								key={index}
								index={index}
								value={tag}
								bg='action.primarySubtle'
								color='action.primaryStrong'
								border='1px solid'
								borderColor='border.interactive'
								borderRadius='full'
								animationName='fade-in'
								animationDuration='180ms'
								_highlighted={{
									bg: 'bg.surface',
									color: 'action.primaryStrong',
								}}
								_selected={{
									bg: 'bg.surface',
									color: 'action.primaryStrong',
								}}
								_dark={{
									bg: 'action.primarySubtle',
									color: 'action.primaryStrong',
									borderColor: 'border.interactive',
									_highlighted: {
										bg: 'bg.surface',
										color: 'action.primaryStrong',
									},
									_selected: {
										bg: 'bg.surface',
										color: 'action.primaryStrong',
									},
								}}
							>
								<TagsInput.ItemPreview
									bg='transparent'
									color='action.primaryStrong'
									_highlighted={{
										color: 'action.primaryStrong',
									}}
									_dark={{
										color: 'action.primaryStrong',
										_highlighted: {
											color: 'action.primaryStrong',
										},
									}}
								>
									<TagsInput.ItemText color='action.primaryStrong'>{tag}</TagsInput.ItemText>
									<TagsInput.ItemDeleteTrigger
										color='action.primary'
										_hover={{ color: 'action.primaryStrong' }}
										_dark={{
											color: 'action.primary',
											_hover: { color: 'action.primaryStrong' },
										}}
									/>
								</TagsInput.ItemPreview>
								<TagsInput.ItemInput
									bg='transparent'
									color='action.primaryStrong'
									_dark={{ color: 'action.primaryStrong' }}
								/>
							</TagsInput.Item>
						))}
					</TagsInput.Items>

					<TagsInput.Input
						placeholder={
							limitReached ? 'Limite de tags atingido' : (placeholder ?? 'Adicione uma tag')
						}
						bg='transparent'
						color='fg.default'
						disabled={disabled || limitReached}
						maxLength={maxTagLength}
						_placeholder={{ color: 'fg.muted' }}
						_dark={{
							color: 'fg.default',
							_placeholder: { color: 'fg.muted' },
						}}
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
						color='fg.muted'
						transition='color 0.2s ease'
						_hover={{ color: 'fg.default' }}
						_dark={{
							color: 'fg.muted',
							_hover: { color: 'fg.default' },
						}}
					/>
				</TagsInput.Control>
			</TagsInput.Root>

			<Field.HelperText
				fontSize='0.8125rem'
				lineHeight='1.25rem'
				color='fg.muted'
				mt='0.25rem'
				_dark={{ color: 'fg.muted' }}
			>
				{tagsCount}/{maxTags} tags
			</Field.HelperText>
		</>
	);
}
