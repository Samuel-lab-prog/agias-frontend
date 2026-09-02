import { Field, TagsInput } from '@chakra-ui/react';
import { useState } from 'react';

import { componentColors, componentRadii } from '../../localStyles';

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
						background: `${componentColors.light.accentSoft} !important`,
						color: `${componentColors.light.accentStrong} !important`,
						borderColor: `${componentColors.light.borderHover} !important`,
					},
					"& [data-scope='tags-input'][data-part='itemPreview']": {
						background: 'transparent !important',
						color: `${componentColors.light.accentStrong} !important`,
					},
					"& [data-scope='tags-input'][data-part='itemText']": {
						color: `${componentColors.light.accentStrong} !important`,
					},
					"& [data-scope='tags-input'][data-part='itemDeleteTrigger']": {
						color: `${componentColors.light.accent} !important`,
					},
					"& [data-scope='tags-input'][data-part='itemDeleteTrigger']:hover": {
						color: `${componentColors.light.text} !important`,
					},
					"& [data-scope='tags-input'][data-part='input']": {
						color: `${componentColors.light.text} !important`,
					},
					"& [data-scope='tags-input'][data-part='clearTrigger']": {
						color: `${componentColors.light.textMuted} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='item']": {
						background: `${componentColors.dark.accentSoft} !important`,
						color: `${componentColors.dark.accentStrong} !important`,
						borderColor: `${componentColors.dark.borderHover} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='itemPreview']": {
						color: `${componentColors.dark.accentStrong} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='itemText']": {
						color: `${componentColors.dark.accentStrong} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='itemDeleteTrigger']": {
						color: `${componentColors.dark.accent} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='itemDeleteTrigger']:hover": {
						color: `${componentColors.dark.text} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='input']": {
						color: `${componentColors.dark.text} !important`,
					},
					".dark & [data-scope='tags-input'][data-part='clearTrigger']": {
						color: `${componentColors.dark.textMuted} !important`,
					},
				}}
				onValueChange={(details) => onValueChange(details.value)}
			>
				<TagsInput.Control
					bg={componentColors.light.background}
					color={componentColors.light.text}
					border='1px solid'
					borderColor={
						hasError
							? componentColors.light.error
							: isFocused
								? componentColors.light.borderHover
								: componentColors.light.border
					}
					borderRadius={componentRadii.md}
					px='0.5rem'
					fontSize='0.8125rem'
					lineHeight='1.25rem'
					py='0.5rem'
					minH='42px'
					transition='all 0.22s ease'
					_hover={{
						borderColor: hasError ? componentColors.light.error : componentColors.light.borderHover,
						bg: componentColors.light.surface,
					}}
					_focusWithin={{
						borderColor: hasError ? componentColors.light.error : componentColors.light.borderHover,
						boxShadow: `0 0 0 5px ${
							hasError ? componentColors.light.errorSoft : componentColors.light.focusRing
						}`,
						bg: componentColors.light.surface,
					}}
					_dark={{
						bg: componentColors.dark.background,
						color: componentColors.dark.text,
						borderColor: hasError
							? componentColors.dark.error
							: isFocused
								? componentColors.dark.borderHover
								: componentColors.dark.border,
						_hover: {
							borderColor: hasError ? componentColors.dark.error : componentColors.dark.borderHover,
							bg: componentColors.dark.surface,
						},
						_focusWithin: {
							borderColor: hasError ? componentColors.dark.error : componentColors.dark.borderHover,
							boxShadow: `0 0 0 5px ${
								hasError ? componentColors.dark.errorSoft : componentColors.dark.focusRing
							}`,
							bg: componentColors.dark.surface,
						},
					}}
				>
					<TagsInput.Items>
						{selectedTags.map((tag: string, index: number) => (
							<TagsInput.Item
								key={index}
								index={index}
								value={tag}
								bg={componentColors.light.accentSoft}
								color={componentColors.light.accentStrong}
								border='1px solid'
								borderColor={componentColors.light.borderHover}
								borderRadius={componentRadii.full}
								animationName='fade-in'
								animationDuration='180ms'
								_highlighted={{
									bg: componentColors.light.surface,
									color: componentColors.light.accentStrong,
								}}
								_selected={{
									bg: componentColors.light.surface,
									color: componentColors.light.accentStrong,
								}}
								_dark={{
									bg: componentColors.dark.accentSoft,
									color: componentColors.dark.accentStrong,
									borderColor: componentColors.dark.borderHover,
									_highlighted: {
										bg: componentColors.dark.surface,
										color: componentColors.dark.accentStrong,
									},
									_selected: {
										bg: componentColors.dark.surface,
										color: componentColors.dark.accentStrong,
									},
								}}
							>
								<TagsInput.ItemPreview
									bg='transparent'
									color={componentColors.light.accentStrong}
									_highlighted={{
										color: componentColors.light.accentStrong,
									}}
									_dark={{
										color: componentColors.dark.accentStrong,
										_highlighted: {
											color: componentColors.dark.accentStrong,
										},
									}}
								>
									<TagsInput.ItemText color={componentColors.light.accentStrong}>
										{tag}
									</TagsInput.ItemText>
									<TagsInput.ItemDeleteTrigger
										color={componentColors.light.accent}
										_hover={{ color: componentColors.light.accentStrong }}
										_dark={{
											color: componentColors.dark.accent,
											_hover: { color: componentColors.dark.accentStrong },
										}}
									/>
								</TagsInput.ItemPreview>
								<TagsInput.ItemInput
									bg='transparent'
									color={componentColors.light.accentStrong}
									_dark={{ color: componentColors.dark.accentStrong }}
								/>
							</TagsInput.Item>
						))}
					</TagsInput.Items>

					<TagsInput.Input
						placeholder={
							limitReached ? 'Limite de tags atingido' : (placeholder ?? 'Adicione uma tag')
						}
						bg='transparent'
						color={componentColors.light.text}
						disabled={disabled || limitReached}
						maxLength={maxTagLength}
						_placeholder={{ color: componentColors.light.textMuted }}
						_dark={{
							color: componentColors.dark.text,
							_placeholder: { color: componentColors.dark.textMuted },
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
						color={componentColors.light.textMuted}
						transition='color 0.2s ease'
						_hover={{ color: componentColors.light.text }}
						_dark={{
							color: componentColors.dark.textMuted,
							_hover: { color: componentColors.dark.text },
						}}
					/>
				</TagsInput.Control>
			</TagsInput.Root>

			<Field.HelperText
				fontSize='0.8125rem'
				lineHeight='1.25rem'
				color={componentColors.light.textMuted}
				mt='0.25rem'
				_dark={{ color: componentColors.dark.textMuted }}
			>
				{tagsCount}/{maxTags} tags
			</Field.HelperText>
		</>
	);
}
