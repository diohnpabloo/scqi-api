import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    DATABASE_CLIENT: z.string(),
    PORT: z.coerce.number().default(3333),
    CLOUD_BUCKET_NAME: z.string(),
    CLOUD_ACCESS_KEY: z.string(),
    CLOUD_SECRET_ACESS_KEY: z.string(),
    CLOUD_BUCKET_REGION: z.string(),
    STORAGE_TYPE: z.string(),
    ADMIN_USER_CREATED: z.string(),
    ADMIN_USER_REGISTER: z.string(),
    ADMIN_USER_NAME: z.string(),
    ADMIN_USER_PASSWORD: z.string(),
    ADMIN_USER_EMAIL: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error('Invalid environment variables!', _env.error.format())

    throw new Error('Invalid enviroment variables')
}

export const env = _env.data

