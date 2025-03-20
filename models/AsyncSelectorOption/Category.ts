import { z } from 'zod'
import { asyncSelectorOptionSchema, createAsyncSelectorOption } from '.'
import { Status } from '../Status'

export interface Category extends z.infer<typeof categorySchema> {}

export const categorySchema = asyncSelectorOptionSchema.strict()

export const createCategory = (name: string): Category =>
  createAsyncSelectorOption(name, Status.active)
