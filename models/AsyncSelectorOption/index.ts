import { generateId } from '../../lib/util'
import { Status } from '../Status'

export interface AsyncSelectorOption {
  _id: string
  name: string
  status: Status
}

export const createAsyncSelectorOption = (
  name: string,
  status = Status.active
): AsyncSelectorOption => ({
  _id: generateId(),
  name,
  status,
})
