import { generateId } from '../lib/util'

export abstract class NamedObject {
  readonly _id: string
  constructor(public name: string) {
    this._id = generateId()
  }
}

// There is no need to associate this with NamedObject because as a stub it only needs the fields explicitly defined
export class NamedStub {
  constructor(public name: string, public status: string) {}
}
