import { type AsyncSelectorOption, createAsyncSelectorOption } from '.'

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
