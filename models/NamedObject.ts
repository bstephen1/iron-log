import { v4 as uuid } from 'uuid'

export abstract class NamedObjectKeyless {
  constructor(public name: string) {}
}

export default abstract class NamedObject extends NamedObjectKeyless {
  constructor(public name: string, public readonly _id: string = uuid()) {
    super(name)
  }
}
