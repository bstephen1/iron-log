import { validate, version } from 'uuid'
import { z } from 'zod'

/** enforces an id is a uuid v4*/
export const idSchema = z
  .string()
  .refine((id) => validate(id) && version(id) === 4)

export const dateSchema = z.string().date()

export const stringOrArraySchema = z.string().or(z.array(z.string()))
