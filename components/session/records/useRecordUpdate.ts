import { useCurrentDate } from '../../../app/sessions/[date]/useCurrentDate'
import {
  updateExerciseFields,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import { useUpdateMutation } from '../../../lib/frontend/data/useMutation'
import type { Exercise } from '../../../models/AsyncSelectorOption/Exercise'
import type { Record } from '../../../models/Record'

export function useRecordUpdate(_id = '') {
  const date = useCurrentDate()
  const mutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.records, { date }],
    updateFn: updateRecordFields,
  })

  return (updates: Partial<Record>) => mutate({ _id, updates })
}

export function useExerciseUpdate(_id = '') {
  const mutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.exercises, _id],
    updateFn: updateExerciseFields,
  })

  return (updates: Partial<Exercise>) => mutate({ _id, updates })
}
