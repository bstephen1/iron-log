import { addModifier } from 'lib/frontend/restService'
import Modifier from 'models/Modifier'
import { Dispatch, SetStateAction } from 'react'
import { KeyedMutator } from 'swr'
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
      placeholder="Select or Add New Modifier"
      Constructor={Modifier}
      addNewItem={addModifier}
    />
  )
}
