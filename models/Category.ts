import { generateId } from '../lib/util'

export default class Category {
  constructor(
    public readonly _id: string = generateId(),
    public name: string
  ) {}
}
