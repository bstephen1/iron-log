import dayjs from 'dayjs'
import { DATE_FORMAT, DEFAULT_CLOTHING_OFFSET } from '../lib/frontend/constants'
import { generateId } from '../lib/util'

// todo: weighing with clothes is exact, but the non-clothes value is fuzzy.
// todo: also add time
export default class Bodyweight {
  readonly _id: string
  value: number
  offset: number
  date: string
  isOfficial: boolean
  constructor(
    // public value: number,
    // public date = dayjs().format(DATE_FORMAT),
    // public clothes?: number,
    value: number,
    /** a dayjs() date object that will be formatted internally. This avoids the possibility of being passed an incorrectly formatted date string. */
    dayjsDate = dayjs(),
    isOfficial = true
  ) {
    this._id = generateId()
    this.isOfficial = isOfficial
    this.value = isOfficial ? value : value - DEFAULT_CLOTHING_OFFSET
    this.offset = DEFAULT_CLOTHING_OFFSET
    this.date = dayjsDate.format(DATE_FORMAT)
  }

  /** Update a weigh in that already exists for the current day. The new update can be either official or unofficial.
   *
   * - An official update to an existing official weigh-in will override the existing weigh-in. Likewise with two unofficial weigh-ins.
   * Note that for an official to official update the offset will also be updated such that old value + old offset = new value + new offset, to preserve the unofficial weight.
   * - An unofficial update to an official weigh-in will set the offset such that old value + offset = input value, leaving the original official value unchanged.
   * - An official update to an unofficial weigh-in will set the "value" to the new official weight, and set the new offset such that new value + new offset = old value + old offset
   *
   * An example use case is performing an unclothed official weigh-in in the morning, then performing an unofficial weigh-in later at the gym, which may be different due to wearing clothes or having eaten throughout the day.
   * The official weigh-in is more accurate for weight tracking, but the unofficial weigh-in is more useful for tracking weight moved for bodyweight exercises.
   * */
  update(value: number, isOfficial = true) {
    if (!isOfficial && !this.isOfficial) {
      this.offset = value - this.value
    } else if (isOfficial && this.isOfficial) {
      this.offset = this.offset + this.value - value
      this.value = value
    } else if (isOfficial && !this.isOfficial) {
      this.isOfficial = true
      this.offset = this.value + this.offset - value
      this.value = value
    } else if (!isOfficial && this.isOfficial) {
      this.offset = value - this.value
    }
  }
}
