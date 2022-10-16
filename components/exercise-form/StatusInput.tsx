import { MenuItem, TextField } from '@mui/material';
import { ExerciseStatus } from '../../models/ExerciseStatus';

interface Props {
    status?: ExerciseStatus,
    handleChange: (status: ExerciseStatus) => void,
}
export default function StatusInput({ status, handleChange }: Props) {
    const statuses = Object.values(ExerciseStatus)

    return (
        <TextField
            select
            required
            label='Status'
            disabled={!status}
            helperText=' ' //for padding
            value={status || ''}
            onChange={(e) => handleChange(e.target.value as ExerciseStatus)}
        >
            {statuses.map(status => (
                <MenuItem key={status} value={status}>
                    {status}
                </MenuItem>
            ))}
        </TextField>
    )
}