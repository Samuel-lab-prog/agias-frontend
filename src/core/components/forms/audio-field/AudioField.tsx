import { Box, Field, Flex, HStack, Text } from '@chakra-ui/react';
import { Mic, Square, Trash2, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type FieldValues, useController } from 'react-hook-form';

import { BaseButton } from '../../Button';
import { useAudioPreview } from './hooks';
import type { AudioFieldProps } from './types';
import { pickAudioMimeType, resolveAudioLabels } from './utils';

export function AudioField<T extends FieldValues>({
	control,
	name,
	label,
	required,
	error,
	accept = 'audio/*',
	disabled,
	labels,
}: AudioFieldProps<T>) {
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const audioFileInputRef = useRef<HTMLInputElement | null>(null);

	const [isRecording, setIsRecording] = useState(false);
	const [recorderError, setRecorderError] = useState('');

	const { field, fieldState } = useController({
		control,
		name,
		rules: {
			required: required ? 'This field is required.' : false,
		},
	});
	const file = field.value as File | null | undefined;
	const resolvedError = fieldState.error ?? error;
	const errorMessage = resolvedError?.message?.toString();
	const hasError = Boolean(errorMessage);

	const { previewUrl, previewSource, setPreviewSource } = useAudioPreview(file);

	const stopMediaStream = useCallback(() => {
		mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
		mediaStreamRef.current = null;
	}, []);

	useEffect(
		() => () => {
			stopMediaStream();
		},
		[stopMediaStream],
	);

	const labelsResolved = resolveAudioLabels(labels);

	const handleStartRecording = useCallback(async () => {
		setRecorderError('');

		if (isRecording || disabled) return;
		if (!navigator.mediaDevices?.getUserMedia) {
			setRecorderError('Recording not supported in this browser.');
			return;
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaStreamRef.current = stream;

			const mimeType = pickAudioMimeType();
			const recorder = mimeType
				? new MediaRecorder(stream, { mimeType })
				: new MediaRecorder(stream);

			audioChunksRef.current = [];
			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) audioChunksRef.current.push(event.data);
			};
			recorder.onstop = () => {
				const blob = new Blob(audioChunksRef.current, {
					type: recorder.mimeType || mimeType || 'audio/webm',
				});

				const extension = (blob.type || 'audio/webm').split('/')[1] || 'webm';
				const nextFile = new File([blob], `audio-${Date.now()}.${extension}`, {
					type: blob.type || 'audio/webm',
				});

				setPreviewSource('recorded');
				field.onChange(nextFile);
				stopMediaStream();
			};

			recorder.start();
			mediaRecorderRef.current = recorder;
			setIsRecording(true);
		} catch {
			stopMediaStream();
			setRecorderError('Could not access the microphone.');
		}
	}, [disabled, field, isRecording, setPreviewSource, stopMediaStream]);

	const handleStopRecording = useCallback(() => {
		if (!isRecording) return;
		mediaRecorderRef.current?.stop();
		setIsRecording(false);
	}, [isRecording]);

	const handleDiscardRecording = useCallback(() => {
		if (isRecording) {
			mediaRecorderRef.current?.stop();
			setIsRecording(false);
		}

		setPreviewSource(null);
		field.onChange(null);
	}, [field, isRecording, setPreviewSource]);

	const handleSelectAudioFile = useCallback(
		(nextFile: File | null) => {
			setPreviewSource(nextFile ? 'uploaded' : null);
			field.onChange(nextFile);
		},
		[field, setPreviewSource],
	);

	return (
		<Field.Root required={required} invalid={hasError} w='full'>
			<Field.Label
				fontSize='0.875rem'
				lineHeight='1.4rem'
				fontWeight='medium'
				color={hasError ? 'status.error' : 'fg.default'}
				transition='color 0.22s ease'
				_dark={{
					color: hasError ? 'status.error' : 'fg.default',
				}}
			>
				{label}
				{required && <Field.RequiredIndicator />}
			</Field.Label>

			{previewUrl && (
				<Box mb={3} mt={1}>
					<Text
						fontSize='0.8125rem'
						lineHeight='1.25rem'
						color={'fg.muted'}
						mb={2}
						_dark={{ color: 'fg.muted' }}
					>
						{previewSource === 'recorded'
							? labelsResolved.previewRecorded
							: labelsResolved.previewUploaded}
					</Text>
					<audio controls preload='metadata' src={previewUrl} />
				</Box>
			)}

			<Flex gap={{ base: 1.5, md: 2 }} wrap='wrap'>
				<BaseButton
					size={{ base: '2xs', md: 'xs' }}
					variant='primary'
					onClick={handleStartRecording}
					disabled={isRecording || disabled}
				>
					<HStack gap={1.5}>
						<Mic size={12} />
						<Text fontSize='0.8125rem' lineHeight='1.25rem'>
							{labelsResolved.record}
						</Text>
					</HStack>
				</BaseButton>
				<BaseButton
					size={{ base: '2xs', md: 'xs' }}
					variant='secondary'
					onClick={handleStopRecording}
					disabled={!isRecording || disabled}
				>
					<HStack gap={1.5}>
						<Square size={12} />
						<Text fontSize='0.8125rem' lineHeight='1.25rem'>
							{labelsResolved.stop}
						</Text>
					</HStack>
				</BaseButton>
				<BaseButton
					size={{ base: '2xs', md: 'xs' }}
					variant='subtle'
					onClick={handleDiscardRecording}
					disabled={!file || disabled}
				>
					<HStack gap={1.5}>
						<Trash2 size={12} />
						<Text fontSize='0.8125rem' lineHeight='1.25rem'>
							{labelsResolved.discard}
						</Text>
					</HStack>
				</BaseButton>
				<BaseButton
					size={{ base: '2xs', md: 'xs' }}
					variant='secondary'
					onClick={() => audioFileInputRef.current?.click()}
					disabled={disabled}
				>
					<HStack gap={1.5}>
						<Upload size={12} />
						<Text fontSize='0.8125rem' lineHeight='1.25rem'>
							{labelsResolved.upload}
						</Text>
					</HStack>
				</BaseButton>
			</Flex>
			<input
				ref={audioFileInputRef}
				type='file'
				accept={accept}
				hidden
				onChange={(event) => {
					const nextFile = event.target.files?.[0] ?? null;
					handleSelectAudioFile(nextFile);
				}}
				disabled={disabled}
			/>

			{file && (
				<Text
					fontSize='0.8125rem'
					lineHeight='1.25rem'
					color={'fg.muted'}
					mt={2}
					_dark={{ color: 'fg.muted' }}
				>
					Selected file: {file.name}
				</Text>
			)}

			{recorderError && (
				<Text
					fontSize='0.875rem'
					lineHeight='1.4rem'
					color={'status.warning'}
					mt={2}
					_dark={{ color: 'status.warning' }}
				>
					{recorderError}
				</Text>
			)}

			<Box
				display='grid'
				gridTemplateRows={hasError ? '1fr' : '0fr'}
				transition='grid-template-rows 0.24s ease'
			>
				<Field.ErrorText
					color={'status.error'}
					_dark={{ color: 'status.error' }}
					opacity={hasError ? 1 : 0}
					transform={hasError ? 'translateY(0)' : 'translateY(-3px)'}
					overflow='hidden'
					minH={0}
					mt={hasError ? 1 : 0}
					transition='opacity 0.2s ease, transform 0.2s ease, margin-top 0.2s ease'
				>
					{errorMessage}
				</Field.ErrorText>
			</Box>
		</Field.Root>
	);
}
