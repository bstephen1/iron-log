import { memo, useCallback } from 'react'
import { z } from 'zod'
import { Status } from '../../models/Status'
import SelectFieldAutosave from './SelectFieldAutosave'

interface Props {
  status: Status
  handleUpdate: (updates: { status: Status }) => void
}
export default memo(function StatusSelectField({
  status,
  handleUpdate,
}: Props) {
  return (
    <SelectFieldAutosave
      label="Status"
      options={Object.values(Status)}
      initialValue={status}
      required
      fullWidth
      schema={z.string({ message: 'Must have a status' })}
      handleSubmit={useCallback(
        // unsure why we need to specify type Status here. Will otherwise assume it's "never"
        (status: Status) => handleUpdate({ status }),
        [handleUpdate]
      )}
    />
  )
})
