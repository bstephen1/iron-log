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

// SelectorBase and withAsync both need the props from withModifier.
// withAsync does not directly provide the props SelectorBase needs.
// withAsync needs typing that shows that its props are the required props from SelectorBase and it passes them along.
// Also, it's not just SelectorBase: it can be any Autocomplete. See ComboBoxField.
export const ModifierSelector = withModifier(withAsync(SelectorBase<Modifier>))
// export const ModifierSelector = withAsync(withModifier(SelectorBase<Modifier>))
