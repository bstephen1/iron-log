import * as yup from 'yup'
import { Status } from '../../models/Status'
import SelectFieldAutosave from './SelectFieldAutosave'

interface Props {
  initialValue: Status
  handleSubmit: (status: Status) => void
}
export default function StatusSelect({ initialValue, handleSubmit }: Props) {
  return (
    <SelectFieldAutosave
      label="Status"
      options={Object.values(Status)}
      initialValue={initialValue}
      required
      fullWidth
      yupValidator={yup.string().required('Must have a status')}
      handleSubmit={handleSubmit}
    />
  )
}
