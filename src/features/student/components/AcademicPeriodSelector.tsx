import { Box, NativeSelect, Text } from '@chakra-ui/react';
import { interactiveStyles } from '@core/themes/motion';

type AcademicPeriodSelectorProps = {
	periods: string[];
	value: string;
	onChange: (period: string) => void;
};

export function AcademicPeriodSelector({ periods, value, onChange }: AcademicPeriodSelectorProps) {
	return (
		<Box as='label' minW='190px' width={{ base: 'full', sm: 'auto' }}>
			<Text fontSize='xs' fontWeight='700' mb={1}>
				Período letivo
			</Text>
			<NativeSelect.Root>
				<NativeSelect.Field
					{...interactiveStyles.field}
					minH='44px'
					value={value}
					onChange={(event) => onChange(event.target.value)}
					aria-label='Filtrar por período letivo'
				>
					<option value='all'>Todos os períodos</option>
					{periods.map((period) => (
						<option key={period} value={period}>
							{period}
						</option>
					))}
				</NativeSelect.Field>
				<NativeSelect.Indicator />
			</NativeSelect.Root>
		</Box>
	);
}
