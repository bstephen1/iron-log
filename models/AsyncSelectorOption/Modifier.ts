import { AsyncSelectorOption } from '.'
import { Status } from '../Status'

// todo: instead of status, how about group? Eg, group == "grip width", containing wide and narrow.
// And groups can have a validation restraint that only 1 element of the same group can be selected
export default class Modifier extends AsyncSelectorOption {
  constructor(
    public name: string,
    public weight?: number | null,
  ) {
    super(name, Status.active)
  }
}
