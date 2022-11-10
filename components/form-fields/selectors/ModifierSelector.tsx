import { addModifier } from '../../../lib/frontend/restService'
import Modifier from '../../../models/Modifier'
import { NamedStub } from '../../../models/NamedObject'
import withAsync from '../withAsync'
import SelectorBase from './SelectorBase'

const withModifier = (Component) => (props) => {
  class NewModifierStub implements NamedStub {
    constructor(public name: string, public status = 'Add New') {}
  }

  return (
    <Component
      {...props}
      options={props.modifiers}
      label="Modifier"
      // todo: do we want modifiers to have status?
      groupBy={(option: Modifier | NewModifierStub) =>
        option.status === 'Add New' ? option.status : 'Modifier'
      }
      placeholder="Select or Add a Modifier"
      StubConstructor={NewModifierStub}
      Constructor={Modifier}
      addNewItem={addModifier}
    />
  )
}

export const ModifierSelector = withModifier(withAsync(SelectorBase<Modifier>))
