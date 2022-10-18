import { TextField } from '@mui/material';
import { useContext } from 'react';
import { ExerciseFormContext } from './useExerciseForm';


export default function NotesInput() {
    const { notes, setField } = useContext(ExerciseFormContext)

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