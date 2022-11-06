import { generateId } from '../lib/util'
import { Record } from './Record'

export class Session {
  constructor(
    public readonly _id = generateId(),
    public readonly date: string,
    public records: Record[] = []
  ) {}
}
