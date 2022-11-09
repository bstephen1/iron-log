import { generateId } from '../lib/util'

export default class Category {
  constructor(
    public name: string,
    public readonly _id: string = generateId()
  ) {}
}
