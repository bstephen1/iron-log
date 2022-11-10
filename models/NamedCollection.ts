import { v4 as uuid } from 'uuid'

export abstract class NamedCollectionKeyless {
  constructor(public name: string) {}
}

export default abstract class NamedCollection extends NamedCollectionKeyless {
  constructor(public name: string, public readonly _id: string = uuid()) {
    super(name)
  }
}
