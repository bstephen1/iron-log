import { Autocomplete, TextField } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useEffect, useState } from 'react';
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
    // const { dirtyExercise, formValidity, resetExercise } = useContext(ExerciseFormContext)

    //todo: tmp vars to not break stuff
    const dirtyExercise = { cues: [] }
    const resetExercise = () => { }

    //todo: let ts know that dirtyExercise can't be null if exercise is populated
    //todo: validate (drop empty cues)
    function handleSubmit() {
        console.log(dirtyExercise)
        updateExercise(dirtyExercise)
        setExercise(dirtyExercise)
        mutate(exercises)
    }

    function handleDeleteCue(i: number) {
        const newCues = dirtyExercise.cues.slice(0, i).concat(dirtyExercise.cues.slice(i + 1))
        const newExercise = { ...dirtyExercise, cues: newCues }
        setDirtyExercise(newExercise)
    }

    function handleCueUpdate(newCue: string, i: number) {
        const newCues = dirtyExercise.cues.slice(0, i).concat(newCue).concat(dirtyExercise?.cues.slice(i + 1))
        console.log('updating...')
        console.log(newCues)
        setDirtyExercise({ ...dirtyExercise, cues: newCues })
    }

    //todo: remove (for testing)
    useEffect(() => {
        console.log(dirtyExercise)
        console.log(dirtyExercise?.cues)
    }, [dirtyExercise])

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
                    <ExerciseForm exercise={exercise} />
                </ExerciseFormProvider>
            </Grid>
        </Grid >
    )

}