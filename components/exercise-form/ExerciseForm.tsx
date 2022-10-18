import { Button, Stack } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useContext } from 'react';
import Exercise from '../../models/Exercise';
import CuesList from './CuesList';
import ModifiersInput from './ModifiersInput';
import NameInput from './NameInput';
import NotesInput from './NotesInput';
import StatusInput from './StatusInput';
import { ExerciseFormContext } from './useExerciseForm';

interface Props {
    exercise: Exercise | null,
    handleSubmit: (exercise: Exercise) => void
}
export default function ExerciseForm({ exercise, handleSubmit }: Props) {
    const { dirtyExercise, invalidFields, resetExercise } = useContext(ExerciseFormContext)

    //if a field was once invalid but now valid, it will be undefined
    const isFormValid = Object.keys(invalidFields).every((key) => !invalidFields[key])

    //todo: let ts know that dirtyExercise can't be null if exercise is populated
    //todo: validate (drop empty cues)
    function validateAndSubmit() {
        isFormValid && handleSubmit(dirtyExercise)
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
                <Stack>
                    <NameInput />
                    <StatusInput />
                    <ModifiersInput />
                </Stack>
            </Grid>
            <Grid xs={12} sm={6}>
                <CuesList />
            </Grid>
            <Grid xs={12}>
                <NotesInput />
            </Grid>
            <Grid xs={12}>
                <Button onClick={resetExercise} disabled={!exercise}>Reset</Button>
                {/* todo: disable when no changes */}
                <Button variant='contained' disabled={!exercise || !isFormValid} onClick={validateAndSubmit}>Save Changes</Button>
                {/* put a warning / error icon if there is warning (no changes) or error (invalid changes)? */}
            </Grid>
        </Grid>
    )
}