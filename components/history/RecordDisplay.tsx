import type { SetType } from '../../models/Set'

export default interface RecordDisplay {
  grouping: RecordDisplayGrouping
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

export type RecordDisplayGrouping = (typeof recordDisplayGroupings)[number]
export const recordDisplayGroupings = ['daily', 'weekly', 'monthly'] as const
