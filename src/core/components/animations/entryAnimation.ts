import { motionTokens } from '../../themes/motion';

type EntryAnimationOptions = {
	baseDelayMs?: number;
	delayStepMs?: number;
	durationMs?: number;
};

export function getStaggeredEntryAnimationStyle(
	index: number,
	options: EntryAnimationOptions = {},
) {
	const { baseDelayMs = 0, delayStepMs = motionTokens.staggerMs, durationMs = 320 } = options;

	return {
		animationName: 'agias-enter',
		animationDuration: `${durationMs}ms`,
		animationTimingFunction: motionTokens.easing,
		animationFillMode: 'backwards',
		animationDelay: `${Math.min(motionTokens.maxStaggerMs, baseDelayMs + Math.max(0, index) * delayStepMs)}ms`,
		_motionReduce: { animation: 'none' },
	} as const;
}
