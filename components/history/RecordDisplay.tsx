import { SetType } from 'models/Record'

export default interface RecordDisplay {
  operator: RecordDisplayOperator
  field: SetType['field']
}

export type RecordDisplayOperator = (typeof recordDisplayOperators)[number]
export const recordDisplayOperators = [
  'highest',
  'lowest',
  'average',
  'total',
] as const
