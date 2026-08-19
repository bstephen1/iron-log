import { type AsyncSelectorOption, createAsyncSelectorOption } from '.'
import { isExercise } from './Exercise'

export interface Modifier extends AsyncSelectorOption {
  weight?: number | null
}

export const createModifier = (
  name: string,
  weight?: number | null
): Modifier => ({
  ...createAsyncSelectorOption(name),
  weight,
})

export const isModifier = (thing: unknown): thing is Modifier =>
  !!thing &&
  typeof thing === 'object' &&
  'weight' in thing &&
  !isExercise(thing)
