import { generateId } from '../lib/util'
import { ModifierStatus } from './ModifierStatus'

// todo: instead of status, how about group? Eg, group == "grip width", containing wide and narrow.
// And groups can have a validation restraint that only 1 element of the same group can be selected
export default class Modifier {
  constructor(
    public name: string,
    public status: ModifierStatus = ModifierStatus.ACTIVE,
    public canDelete: boolean = true,
    public readonly _id: string = generateId()
  ) {}
}
