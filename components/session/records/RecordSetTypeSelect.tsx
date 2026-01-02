import { useRecord } from '../../../lib/frontend/data/useQuery'
import { calculateTotalValue } from '../../../models/Set'
import type { Units } from '../../../models/Units'
import SetTypeSelect from './SetTypeSelect'
import { useRecordUpdate } from './useRecordUpdate'

interface Props {
  _id: string
  date: string
  units: Units
}
export default function RecordSetTypeSelect({ _id, date, units }: Props) {
  const updateRecord = useRecordUpdate(_id)
  const { setType, sets } = useRecord(_id, date)

  return (
    <SetTypeSelect
      units={units}
      totalReps={calculateTotalValue(sets, setType)}
      showRemaining
      handleChange={updateRecord}
      {...{ setType }}
    />
  )
}
