import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
})

console.log(
  `=> API running with ${
    process.env.NODE_ENV?.toUpperCase() || 'DEV'
  } environment!`
)
console.log('======================================')

import { z } from 'zod'

const DEFAULT_PORT = 7000

const envSchema = z.object({
  NODE_ENV: z.string().default('dev'),
  PORT: z.coerce.number().default(DEFAULT_PORT),
  DB_NAME: z.string().default('jbimobiliaria'),
  DB_URL: z.string().default('mongodb://localhost:27017'),
  REDIS_URL: z.string().default('127.0.0.1'),
  SECRET_AUTH: z
    .string()
    .default('1GH23jduihsSqFi6oedpniUask29OGpwmnSugGwziviIvoVNB3BF3daw5'),
  EXPIRE_AUTH: z.string().default('1d'),
  // FOCUS_NFE_BASE_URL: z
  //   .string()
  //   .default('https://homologacao.focusnfe.com.br/v2'),
  // FOCUS_NFE_TOKEN: z.string().default('hb5mYGx64HAZEEqVkku1aE0jJ2SUg4YG'),
  API_URL: z.string().default(`http://localhost:${DEFAULT_PORT}`),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment varibles.')
}

export const env = _env.data
