import { MenuItem, TextField } from '@mui/material'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import { useExerciseFormContext } from './useExerciseForm'

export default function StatusInput() {
  const { status, setField } = useExerciseFormContext()
  const statuses = Object.values(ExerciseStatus)

  return (
    <TextField
      select
      required
      label='Status'
      disabled={!status}
      helperText=' ' //for padding
      value={status ?? ''}
      onChange={(e) => setField('status', e.target.value as ExerciseStatus)}
    >
      {statuses.map((status) => (
        <MenuItem key={status} value={status}>
          {status}
        </MenuItem>
      ))}
    </TextField>
  )
}
