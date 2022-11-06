import { generateId } from '../lib/util'
import Record from './Record'

export default class Session {
  constructor(
    public readonly date: string,
    public records: Record['_id'][] = [], // stores the order of the Records
    public readonly _id = generateId()
  ) {}
}
