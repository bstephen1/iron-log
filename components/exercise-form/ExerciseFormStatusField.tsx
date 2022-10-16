import { MenuItem, TextField } from '@mui/material';
import { ExerciseStatus } from '../../models/ExerciseStatus';

interface Props {
    status?: ExerciseStatus,
    handleStatusChange: (status: ExerciseStatus) => void,
}
export default function ExerciseFormStatusField({ status, handleStatusChange }: Props) {
    const statuses = Object.values(ExerciseStatus)

    return (
        <TextField
            select
            required
            label='Status'
            disabled={!status}
            helperText=' ' //for padding
            value={status || ''}
            onChange={(e) => handleStatusChange(e.target.value as ExerciseStatus)}
        >
            {statuses.map(status => (
                <MenuItem key={status} value={status}>
                    {status}
                </MenuItem>
            ))}
        </TextField>
    )
}