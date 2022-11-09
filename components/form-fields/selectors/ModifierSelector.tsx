// @ts-nocheck
// todo: typing
import { addModifier } from '../../../lib/frontend/restService'
import Modifier from '../../../models/Modifier'
import withAsync from '../withAsync'
import SelectorBase from './SelectorBase'

const withModifier = (Component) => (props) => {
  // temporarily store the current input in a stub and only create a true Modifier if the stub is selected
  class NewModifierStub {
    constructor(public name: string) {}
  }

  return (
    <Component
      {...props}
      options={props.modifiers}
      label="Modifier"
      placeholder="Select or Add a Modifier"
      NewItemStub={NewModifierStub}
      ItemConstructor={Modifier}
      addNewItem={addModifier}
    />
  )
}

export const ModifierSelector = withModifier(withAsync(SelectorBase<Modifier>))
