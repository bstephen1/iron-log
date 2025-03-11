import { AsyncSelectorOption, createAsyncSelectorOption } from '.'
import { Status } from '../Status'

export interface Category extends AsyncSelectorOption {}

export const createCategory = (name: string): Category =>
  createAsyncSelectorOption(name, Status.active)
