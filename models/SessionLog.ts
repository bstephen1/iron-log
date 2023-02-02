import { generateId } from '../lib/util'
import Record from './Record'

// todo: add session time. Start / end times? Program stuff (not hashed out yet), overall notes?
// todo: gym location?
export default class SessionLog {
  constructor(
    public readonly date: string,
    /** An ordered array of associated Record ids */
    public records: Record['_id'][] = [],
    public readonly _id = generateId()
  ) {}
}
