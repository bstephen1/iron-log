import { SelectorBaseOption } from './SelectorBaseOption'
import { Status } from './Status'

export default class Category extends SelectorBaseOption {
  constructor(public name: string, public status: Status = Status.active) {
    super(name, status)
  }
}
