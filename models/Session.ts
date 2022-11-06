import { generateId } from '../lib/util'
import Record from './Record'

export default class Session {
  constructor(
    public readonly date: string,
    public records: Record[] = [],
    public readonly _id = generateId()
  ) {}
}
