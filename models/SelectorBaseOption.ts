import { generateId } from '../lib/util'
import { Status } from './Status'

/** Objects used in SelectorBase must extend this class. */
export abstract class SelectorBaseOption {
  readonly _id: string
  protected constructor(
    public name: string,
    public status: Status = Status.active
  ) {
    this._id = generateId()
  }
}
