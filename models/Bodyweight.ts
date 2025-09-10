import { generateId } from '../lib/util'
import type FetchOptions from './DateRangeQuery'

/** A weigh-in can be one of two types:
 * - Official: Used for tracking bodyweight over time. Ideally measured at the same time of day under similar conditions.
 * - Unofficial: Used for weigh-ins that include extraneous factors that differentiate them from official weigh-ins.
 * The intended use case is to measure weight lifted for bodyweight exercises at the gym.
 */
// See: https://steveholgado.com/typescript-types-from-arrays/
export type WeighInType = (typeof weighInTypes)[number]
export const weighInTypes = ['official', 'unofficial'] as const

export interface Bodyweight {
  _id: string
  value: number
  type: WeighInType
  /** YYYY-MM-DD */
  date: string
}

export const createBodyweight = (
  value: number,
  type: WeighInType,
  date: string
): Bodyweight => ({
  _id: generateId(),
  value,
  type,
  date,
})

export interface BodyweightQuery extends FetchOptions {
  type?: WeighInType
}
