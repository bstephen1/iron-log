import { z } from 'zod'
import { generateId } from '../../lib/util'
import { Status } from '../Status'
import { idSchema } from '../schemas'

export interface AsyncSelectorOption
  extends z.infer<typeof asyncSelectorOptionSchema> {}

export const asyncSelectorOptionSchema = z.object({
  _id: idSchema.default(generateId),
  name: z.string(),
  status: z.nativeEnum(Status).default(Status.active),
})

export const createAsyncSelectorOption = (
  name: string,
  status?: Status
): AsyncSelectorOption => asyncSelectorOptionSchema.parse({ name, status })
