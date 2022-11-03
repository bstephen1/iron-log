import { v4 as uuid } from 'uuid'

export default class Category {
  constructor(public name: string, public readonly _id: string = uuid()) {}
}
