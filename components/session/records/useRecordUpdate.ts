import { useCurrentDate } from '../../../app/sessions/[date]/useCurrentDate'
import {
  updateExerciseFields,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import { useUpdateMutation } from '../../../lib/frontend/data/useMutation'
import type { Exercise } from '../../../models/AsyncSelectorOption/Exercise'
import type { Record } from '../../../models/Record'

// Record cards use the queryKey of the session record list / full exercise list
// restricted to select a single element of the list. This allows data to be shared
// and always up to date, but still optimizes performance to only trigger rerenders
// when the individual list element is changed.

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
    queryKey: [QUERY_KEYS.exercises],
    updateFn: updateExerciseFields,
  })

  return (updates: Partial<Exercise>) => mutate({ _id, updates })
}
