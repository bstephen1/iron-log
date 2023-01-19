import { ModifierStatus } from '../ModifierStatus'

export interface ModifierQuery {
  /** filter based on status value. An invalid status will return an empty array */
  status?: ModifierStatus
}
