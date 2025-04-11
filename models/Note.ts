import { z } from 'zod'
import { generateId } from '../lib/util'
import { idSchema } from './schemas'

export interface Note extends z.infer<typeof noteSchema> {}

export const noteSchema = z.object({
  _id: idSchema,
  value: z.string(),
  tags: z.array(z.string()),
})

export const createNote = (value = '', tags: string[] = []): Note => ({
  _id: generateId(),
  value,
  tags,
})
