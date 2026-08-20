import { Status } from '../Status'
import { type AsyncSelectorOption, createAsyncSelectorOption } from '.'
import { isExercise } from './Exercise'
import { isModifier } from './Modifier'

export interface Category extends AsyncSelectorOption {}

export const createCategory = (name: string): Category =>
  createAsyncSelectorOption(name, Status.active)

export const isCategory = (thing: unknown): thing is Category =>
  !!thing &&
  typeof thing === 'object' &&
  'name' in thing &&
  !isExercise(thing) &&
  !isModifier(thing)
