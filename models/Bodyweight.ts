import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'
import { generateId } from '../lib/util'

// todo: weighing with clothes is exact, but the non-clothes value is fuzzy.
// todo: also add time
export default class Bodyweight {
  constructor(
    public value: number,
    public date = dayjs().format(DATE_FORMAT),
    public clothes?: number,
    public readonly _id = generateId()
  ) {}
}
