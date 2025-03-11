import { Dispatch, SetStateAction } from 'react'
import { KeyedMutator } from 'swr'
import { addModifier } from '../../../lib/frontend/restService'
import {
  createModifier,
  Modifier,
} from '../../../models/AsyncSelectorOption/Modifier'
import AsyncSelector from './AsyncSelector'

interface Props {
  modifiers?: Modifier[]
  modifier: Modifier | null
  mutate: KeyedMutator<Modifier[]>
  handleChange: Dispatch<SetStateAction<Modifier | null>>
}
export default function ModifierSelector({
  modifiers,
  modifier,
  mutate,
  ...asyncSelectorProps
}: Props) {
  return (
    <AsyncSelector
      {...asyncSelectorProps}
      options={modifiers}
      mutateOptions={mutate}
      value={modifier}
      label="Modifier"
      placeholder="Select or add new modifier"
      createOption={createModifier}
      addNewItem={addModifier}
    />
  )
}
