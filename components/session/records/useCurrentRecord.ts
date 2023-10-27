import {
  updateRecordFields,
  useGuaranteedRecord,
} from 'lib/frontend/restService'
import useDisplayFields from 'lib/frontend/useDisplayFields'
import useExtraWeight from 'lib/frontend/useExtraWeight'
import Record from 'models/Record'
import { useRecordContext } from './RecordContext'

/** Use within RecordContext to retrieve record data and mutators.
 *  Record fields are spread out directly for convenient access.
 */
export default function useCurrentRecord() {
  const context = useRecordContext()
  const { record, mutate } = useGuaranteedRecord(context.record)
  const displayFields = useDisplayFields(record)
  const extraWeight = useExtraWeight(record)

  const updateFields = async (changes: Partial<Record>) =>
    mutate(updateRecordFields(record._id, { ...changes }), {
      optimisticData: { ...record, ...changes },
      revalidate: false,
    })

  return {
    record,
    mutate,
    displayFields,
    extraWeight,
    updateFields,
    ...record,
  }
}
