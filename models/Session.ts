import { generateId } from '../lib/util'
import Record from './Record'

// todo: add session time. Start / end times? Program stuff (not hashed out yet), overall notes?
export default class Session {
  constructor(
    public readonly date: string,
    public records: Record['_id'][] = [], // ordered array
    public readonly _id = generateId()
  ) {}
}
