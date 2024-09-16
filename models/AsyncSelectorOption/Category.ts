import { AsyncSelectorOption } from '.'
import { Status } from '../Status'

export default class Category extends AsyncSelectorOption {
  constructor(public name: string) {
    super(name, Status.active)
  }
}
