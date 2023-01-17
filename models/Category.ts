import { NamedObject } from './NamedObject'

export default class Category extends NamedObject {
  constructor(public name: string, public readonly userId: string) {
    super(name, userId)
  }
}
