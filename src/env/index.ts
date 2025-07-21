import { z } from 'zod';

// Valida se a string representa "true" ou "false", ignorando o case, e transforma em booleano
const booleanString = z
  .string()
  .transform((val) => val.toLowerCase())
  .refine((val) => val === 'true' || val === 'false', {
    message: 'Deve ser "true" ou "false" (case insensitive)',
  })
  .transform((val) => val === 'true');

const envSchema = z.object({
  SANDBOX: booleanString,
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  CERTIFICATE: z.string(),
  // .optional(),
  VALIDATE_MTLS: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return true; // valor padrão se não definido
      const lowered = val.toLowerCase();
      if (lowered === 'true') return true;
      if (lowered === 'false') return false;
      throw new Error('VALIDATE_MTLS deve ser "true" ou "false"');
    }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Failed to parse environment variables', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
