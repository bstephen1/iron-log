import { generateId } from '../lib/util'
import NamedCollection from './NamedCollection'

export default class Category extends NamedCollection {
  constructor(public name: string, public readonly _id: string = generateId()) {
    super(name, _id)
  }
}
