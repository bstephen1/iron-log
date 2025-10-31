import { generateId } from '../../lib/util/id'
import { Status } from '../Status'

export interface AsyncSelectorOption {
  _id: string
  name: string
  status: Status
}

export const createAsyncSelectorOption = (
  name: string,
  status?: Status
): AsyncSelectorOption => ({
  _id: generateId(),
  name,
  status: status ?? Status.active,
})
