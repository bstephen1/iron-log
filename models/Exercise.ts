import { DisplayFields } from './DisplayFields'
import Note from './Note'
import { SelectorBaseOption } from './SelectorBaseOption'
import { Status } from './Status'

export default class Exercise extends SelectorBaseOption {
  constructor(
    public name: string,
    public status: Status = Status.active,
    public notes: Note[] = [],
    /** stores a map of display fields per modifier group. Any record that has the same
     * modifiers will show the same fields and units. A hash of the modifier array
     * should be used as the key.
     */
    public defaultDisplayFields: DisplayFieldsMap = {},
    public categories: string[] = [],
    public modifiers: string[] = []
  ) {
    super(name, status)
  }
}

interface DisplayFieldsMap {
  [modifierHash: string]: DisplayFields
}

// displayFieldsModifierMap
// modifierGroupDisplayFields
