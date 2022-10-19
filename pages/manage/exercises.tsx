import { Autocomplete, TextField } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useState } from 'react';
import ExerciseForm from '../../components/exercise-form/ExerciseForm';
import { ExerciseFormProvider } from '../../components/exercise-form/useExerciseForm';
import StyledDivider from '../../components/StyledDivider';
import { updateExercise, useExercises } from '../../lib/frontend/restService';
import Exercise from '../../models/Exercise';

//todo: disable form stuff when no changes
//todo: ui element showing "changes saved". Snackbar?
//todo: add/delete exercise. Delete only for unused exercises?
//todo: filter exercise list by status?
export default function ManageExercisesPage() {
    const { exercises, mutate } = useExercises()
    const [exercise, setExercise] = useState<Exercise | null>(null)

    function handleSubmit(exercise: Exercise) {
        updateExercise(exercise)
        setExercise(exercise)
        mutate(exercises)
    }

    if (!exercises) {
        return <></>
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={12} md={3}>
                <Autocomplete
                    options={exercises} //todo: should sort. localeCompare? Some kind of hardcoded list (eg, favorites > active > archived)?
                    groupBy={exercise => exercise.status}
                    getOptionLabel={option => option.name}
                    value={exercise}
                    onChange={(e, newExercise) => setExercise(newExercise)}
                    renderInput={(params) => <TextField {...params} label='Exercise' />}
                />
            </Grid>
            {/* todo: vertical on md */}
            <Grid xs={12} md={1}>
                <StyledDivider />
            </Grid>
            <Grid container xs={12} md={8}>
                <ExerciseFormProvider cleanExercise={exercise}>
                    <ExerciseForm exercise={exercise} handleSubmit={handleSubmit} />
                </ExerciseFormProvider>
            </Grid>
        </Grid >
    )
}