import { NamedObject } from './NamedObject'

export default class Category extends NamedObject {
  constructor(public name: string) {
    super(name)
  }
}
