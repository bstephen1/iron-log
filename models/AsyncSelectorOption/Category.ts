import { AsyncSelectorOption } from '.'
import { Status } from '../Status'

export default class Category extends AsyncSelectorOption {
  constructor(public name: string, public status: Status = Status.active) {
    super(name, status)
  }
}
