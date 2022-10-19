import { TextField } from '@mui/material';
import { useExerciseFormContext } from './useExerciseForm';

export default function NotesInput() {
    const { notes, setField } = useExerciseFormContext()

    return (
        <TextField
            multiline
            fullWidth
            disabled={notes == null}
            value={notes ?? ''}
            onChange={(e) => setField('notes', e.target.value)}
            label='Notes'
        />
    )
}