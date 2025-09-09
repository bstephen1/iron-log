import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'
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
  /** a dayjs() date object that will be formatted internally.
   * This avoids the possibility of being passed an incorrectly
   * formatted date string. */
  dayjsDate = dayjs()
): Bodyweight => ({
  _id: generateId(),
  value,
  type,
  date: dayjsDate.format(DATE_FORMAT),
})

export interface BodyweightFilter extends FetchOptions {
  type?: WeighInType
}
