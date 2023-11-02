import { useRecord } from 'lib/frontend/restService'
import useDisplayFields from 'lib/frontend/useDisplayFields'
import useExtraWeight from 'lib/frontend/useExtraWeight'
import { useRecordContext } from './RecordContext'

/** Use within RecordContext to retrieve record data and mutators.
 *  Record fields are spread out directly for convenient access.
 *
 *  Note: any time the record's mutate() is called a context change will be triggered,
 *  which causes any component using this hook to rerender.
 */
export default function useCurrentRecord() {
  // Context stores the loaded result of useRecord().
  // It could just store the record id to avoid changing on every mutate,
  // but then we'd have to useRecord here to get the full record,
  // which would still trigger a rerender on mutate and we'd also have to deal with null / undefined types.
  const { record } = useRecordContext()
  const { mutate } = useRecord(record._id)
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
