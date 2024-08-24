import { z } from 'zod'

const props = [
  'PORT',
  'PUBLIC_URL',
  'BACKEND',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'MONGODB_URI',
  'GITHUB_ID',
  'GITHUB_SECRET',
  'NEXTAUTH_DB',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'HELLOCASH_TOKEN',
  'WOOCOMMERCE_DASHBOARD',
  'WOOCOMMERCE_DOMAIN',
  'WOOCOMMERCE_CONSUMER_KEY',
  'WOOCOMMERCE_CONSUMER_SECRET',
  'WINSTON_SILENT',
] as const

const schemaShape: Record<string, z.ZodTypeAny> = {}
props.forEach((key) => {
  schemaShape[key] = z.string().optional()
})

const schema = z.object(schemaShape).superRefine((data, ctx) => {
  for (let prop of props) {
    if (!data.hasOwnProperty(prop) || !data[prop])
      ctx.addIssue({
        code: 'not_finite',
        message: `${prop} is missing`,
      })
  }
})

const env = schema.parse(process.env) as Record<(typeof props)[number], string>
export default env

export function validateEnv() {}
