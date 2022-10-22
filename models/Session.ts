import { Record } from './Record'

export class Session {
  constructor(readonly date: string, public records: Record[] = []) {}
}
