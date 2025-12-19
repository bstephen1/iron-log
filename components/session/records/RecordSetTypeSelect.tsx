import { useExercise, useRecord } from '../../../lib/frontend/data/useQuery'
import useDisplayFields from '../../../lib/frontend/useDisplayFields'
import { calculateTotalValue } from '../../../models/Set'
import SetTypeSelect from './SetTypeSelect'
import { useRecordUpdate } from './useRecordUpdate'

interface Props {
  _id: string
  date: string
}
export default function RecordSetTypeSelect({ _id, date }: Props) {
  const updateRecord = useRecordUpdate(_id)
  const { setType, sets, ...record } = useRecord(_id, date)
  const exercise = useExercise(record.exercise?._id)
  const displayFields = useDisplayFields(exercise)

  return (
    <SetTypeSelect
      units={displayFields.units}
      totalReps={calculateTotalValue(sets, setType)}
      showRemaining
      handleChange={updateRecord}
      {...{ setType }}
    />
  )
}
