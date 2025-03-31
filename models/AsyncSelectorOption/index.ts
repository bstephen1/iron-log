import { z } from 'zod'
import { generateId } from '../../lib/util'
import { Status } from '../Status'

export interface AsyncSelectorOption
  extends z.infer<typeof asyncSelectorOptionSchema> {}

export const asyncSelectorOptionSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  status: z.nativeEnum(Status),
})

export const createAsyncSelectorOption = (
  name: string,
  status = Status.active
): AsyncSelectorOption => ({
  _id: generateId(),
  name,
  status,
})
