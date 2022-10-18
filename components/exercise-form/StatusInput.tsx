import { MenuItem, TextField } from '@mui/material';
import { useContext } from 'react';
import { ExerciseStatus } from '../../models/ExerciseStatus';
import { ExerciseFormContext } from './useExerciseForm';


export default function StatusInput() {
    const statuses = Object.values(ExerciseStatus)
    const { status, setField } = useContext(ExerciseFormContext)

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
            {statuses.map(status => (
                <MenuItem key={status} value={status}>
                    {status}
                </MenuItem>
            ))}
        </TextField>
    )
}