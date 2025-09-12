import { Status } from '../Status'
import { type AsyncSelectorOption, createAsyncSelectorOption } from '.'

export interface Category extends AsyncSelectorOption {}

export const createCategory = (name: string): Category =>
  createAsyncSelectorOption(name, Status.active)
