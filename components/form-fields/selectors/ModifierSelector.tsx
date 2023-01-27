import { Dispatch, SetStateAction } from 'react'
import { KeyedMutator } from 'swr'
import { addModifier } from '../../../lib/frontend/restService'
import Modifier from '../../../models/Modifier'
import withAsync from '../withAsync'
import SelectorBase from './SelectorBase'

interface WithModifierProps {
  modifiers?: Modifier[]
  modifier: Modifier | null
  mutate: KeyedMutator<Modifier[]>
  handleChange: Dispatch<SetStateAction<Modifier | null>>
}
function withModifier(Component: typeof SelectorBase<Modifier>) {
  return function ({
    modifiers,
    modifier,
    mutate,
    ...props
  }: WithModifierProps) {
    return (
      <Component
        {...props}
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
}

export const ModifierSelector = withModifier(withAsync(SelectorBase<Modifier>))
