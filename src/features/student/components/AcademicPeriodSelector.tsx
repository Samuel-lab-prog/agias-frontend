import { Box, Text } from '@chakra-ui/react';

type AcademicPeriodSelectorProps = {
	periods: string[];
	value: string;
	onChange: (period: string) => void;
};

export function AcademicPeriodSelector({ periods, value, onChange }: AcademicPeriodSelectorProps) {
	return (
		<Box as='label' minW='190px'>
			<Text fontSize='xs' fontWeight='700' mb={1}>
				Período letivo
			</Text>
			<select
				value={value}
				onChange={(event) => onChange(event.target.value)}
				aria-label='Filtrar por período letivo'
				style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'transparent' }}
			>
				<option value='all'>Todos os períodos</option>
				{periods.map((period) => (
					<option key={period} value={period}>
						{period}
					</option>
				))}
			</select>
		</Box>
	);
}
