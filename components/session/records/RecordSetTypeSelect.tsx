import { useRecordUpdate } from '../../../hooks/mutation'
import { useExercise, useRecord } from '../../../lib/frontend/restService'
import useDisplayFields from '../../../lib/frontend/useDisplayFields'
import { calculateTotalValue } from '../../../models/Set'
import SetTypeSelect from './SetTypeSelect'

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
