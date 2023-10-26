import { useGuaranteedRecord } from 'lib/frontend/restService'
import useDisplayFields from 'lib/frontend/useDisplayFields'
import useExtraWeight from 'lib/frontend/useExtraWeight'
import { useRecordContext } from './RecordContext'

/** Use within RecordContext to retrieve record data and mutators.
 *  Record fields are spread out directly for convenient access.
 */
export default function useCurrentRecord() {
  const context = useRecordContext()
  const { record, mutate } = useGuaranteedRecord(context.record)
  const displayFields = useDisplayFields(record)
  const extraWeight = useExtraWeight(record)

  return {
    record,
    mutate,
    displayFields,
    extraWeight,
    ...record,
  }
}
