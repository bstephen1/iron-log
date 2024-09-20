import * as yup from 'yup'
import { Status } from '../../models/Status'
import SelectFieldAutosave from './SelectFieldAutosave'
import { memo, useCallback } from 'react'

interface Props {
  initialValue: Status
  handleUpdate: (updates: { status: Status }) => void
}
export default memo(function StatusSelect({
  initialValue,
  handleUpdate,
}: Props) {
  return (
    <SelectFieldAutosave
      label="Status"
      options={Object.values(Status)}
      initialValue={initialValue}
      required
      fullWidth
      yupValidator={yup.string().required('Must have a status')}
      handleSubmit={useCallback(
        // unsure why we need to specify type Status here. Will otherwise assume it's "never"
        (status: Status) => handleUpdate({ status }),
        [handleUpdate],
      )}
    />
  )
})
