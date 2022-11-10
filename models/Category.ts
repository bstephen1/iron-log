import { generateId } from '../lib/util'
import NamedObject from './NamedObject'

export default class Category extends NamedObject {
  constructor(public name: string, public readonly _id: string = generateId()) {
    super(name, _id)
  }
}
