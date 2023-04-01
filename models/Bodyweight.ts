import dayjs from 'dayjs'
import { DATE_FORMAT } from 'lib/frontend/constants'
import { generateId } from 'lib/util'

export default class Bodyweight {
  readonly _id: string
  /** YYYY-MM-DD */
  date: string
  constructor(
    public value: number,
    public type: WeighInType,
    /** a dayjs() date object that will be formatted internally. This avoids the possibility of being passed an incorrectly formatted date string. */
    dayjsDate = dayjs()
  ) {
    this._id = generateId()
    this.date = dayjsDate.format(DATE_FORMAT)
  }
}

/** A weigh-in can be one of two types:
 * - Official: Used for tracking bodyweight over time. Ideally measured at the same time of day under similar conditions.
 * - Unofficial: Used for weigh-ins that include extraneous factors that differentiate them from official weigh-ins.
 * The intended use case is to measure weight lifted for bodyweight exercises at the gym.
 */
// See: https://steveholgado.com/typescript-types-from-arrays/
export type WeighInType = (typeof weighInTypes)[number]
export const weighInTypes = ['official', 'unofficial'] as const
