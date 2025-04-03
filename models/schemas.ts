import { validate, version } from 'uuid'
import { z } from 'zod'

/** enforces an id is a uuid v4*/
export const idSchema = z
  .string()
  .refine((id) => validate(id) && version(id) === 4, 'invalid id')

/** enforces YYYY-MM-DD format */
export const dateSchema = z.string().date()

/** enforces api query param format, which may be string | string[] */
export const apiArraySchema = z.string().or(z.array(z.string()))
