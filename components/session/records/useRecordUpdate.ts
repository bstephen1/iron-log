import { updateRecordFields } from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import { useUpdateMutation } from '../../../lib/frontend/restService'
import type { Record } from '../../../models/Record'

export default function useRecordUpdate(_id: string) {
  const updateRecordMutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.records, _id],
    updateFn: updateRecordFields,
  })

  return (updates: Partial<Record>) => updateRecordMutate({ _id, updates })
}
