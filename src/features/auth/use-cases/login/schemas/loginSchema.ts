import { z } from 'zod';

export const loginSchema = z.object({
	cpf: z
		.string()
		.trim()
		.regex(/^\d{11}$/, 'CPF inválido. Use apenas os 11 dígitos, sem pontos ou traços.'),
	password: z.string().min(1, 'A senha é obrigatória.'),
});

export type LoginDataType = z.infer<typeof loginSchema>;
