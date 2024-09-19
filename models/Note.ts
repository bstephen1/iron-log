import { generateId } from '../lib/util'

export default class Note {
  readonly _id: string
  constructor(
    public value = '',
    public tags: string[] = [],
  ) {
    this._id = generateId()
  }
}
