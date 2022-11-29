import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'
import { generateId } from '../lib/util'

export default class Bodyweight {
  constructor(
    public value: number,
    public clothes?: number,
    public date = dayjs().format(DATE_FORMAT),
    public readonly _id = generateId()
  ) {}
}
