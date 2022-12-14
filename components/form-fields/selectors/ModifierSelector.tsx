import { Dispatch, SetStateAction } from 'react'
import { KeyedMutator } from 'swr'
import { addModifier } from '../../../lib/frontend/restService'
import Modifier from '../../../models/Modifier'
import { NamedStub } from '../../../models/NamedObject'
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
    class NewModifierStub implements NamedStub {
      constructor(public name: string, public status = 'Add New') {}
    }

    return (
      <Component
        {...props}
        options={modifiers}
        mutateOptions={mutate}
        value={modifier}
        label="Modifier"
        // todo: do we want modifiers to have status?
        groupBy={(option: Modifier | NewModifierStub) =>
          option.status === 'Add New' ? option.status : 'Modifier'
        }
        placeholder="Select or Add New Modifier"
        StubConstructor={NewModifierStub}
        Constructor={Modifier}
        addNewItem={addModifier}
      />
    )
  }
}

export const ModifierSelector = withModifier(withAsync(SelectorBase<Modifier>))
