import { Autocomplete, Button, Divider, Stack, TextField } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useEffect, useState } from 'react';
import CuesInput from '../../components/exercise-form/CuesInput';
import ModifiersInput from '../../components/exercise-form/ModifiersInput';
import StatusInput from '../../components/exercise-form/StatusInput';
import StyledDivider from '../../components/StyledDivider';
import { updateExercise, useExercises } from '../../lib/frontend/restService';
import Exercise from '../../models/Exercise';
import { ExerciseStatus } from '../../models/ExerciseStatus';

//todo: disable form stuff when no changes
//todo: ui element showing "changes saved". Snackbar?
//todo: add/delete exercise. Delete only for unused exercises?
//todo: filter exercise list by status?
export default function ManageExercisesPage() {
    const { exercises, mutate } = useExercises()

    const [exercise, setExercise] = useState<Exercise | null>(null)

    interface DirtyNameValidity {
        isError: boolean,
        reason: string,
    }
    const [dirtyNameValidity, setDirtyNameValidity] = useState<DirtyNameValidity>()
    const [dirtyExercise, setDirtyExercise] = useState<Exercise | null>(null)
    const statuses = Object.values(ExerciseStatus)
    //todo: confirmation when you try to leave page or switch exercise that Name change will be discarded if error
    const isNameError = !!exercise && dirtyNameValidity?.isError
    const INVISIBLE_HELPER_TEXT = ' ' //use this to keep height constant when there's no helper text

    function handleReset() {
        setDirtyExercise(exercise)
    }

    //todo: let ts know that dirtyExercise can't be null if exercise is populated
    //todo: validate (drop empty cues)
    function handleSubmit() {
        console.log(dirtyExercise)
        updateExercise(dirtyExercise)
        setExercise(dirtyExercise)
        mutate(exercises)
    }

    function handleExerciseChange(newExercise: Exercise | null) {
        setDirtyExercise(newExercise)
        setExercise(newExercise)
        setDirtyNameValidity({
            isError: false,
            reason: INVISIBLE_HELPER_TEXT,
        })
    }

    function handleDirtyNameChange(newName: string) {
        let isError = false
        let reason = INVISIBLE_HELPER_TEXT

        if (!newName) {
            isError = true
            reason = `Can't have an empty name!`
        } else if (exercise?.name === newName) {
            //valid -- explicity stated to avoid unnecessary find()
        } else if (exercises?.find(e => e.name === newName)) {
            isError = true
            reason = 'This exercise already exists!'
        }

        setDirtyExercise({ ...dirtyExercise, name: newName })
        setDirtyNameValidity({
            isError: isError,
            reason: reason,
        })
    }

    //todo: really want to try to avoid the non-null assertion. How to let ts know this can't be called if dirtyExercise is null?
    function handleStatusChange(newStatus: ExerciseStatus) {
        setDirtyExercise({ ...dirtyExercise!, status: newStatus })
    }

    function handleModifiersChange(newModifiers: string[]) {
        setDirtyExercise({ ...dirtyExercise!, validModifiers: newModifiers })
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
            {/* todo: big screens. Switch to side by side? vertical divider? */}
            <Grid xs={12} md={3}>
                <Autocomplete
                    options={exercises} //todo: should sort. localeCompare? Some kind of hardcoded list (eg, favorites > active > archived)?
                    groupBy={exercise => exercise.status}
                    getOptionLabel={option => option.name}
                    value={exercise}
                    onChange={(e, newExercise) => handleExerciseChange(newExercise)}
                    renderInput={(params) => <TextField {...params} label='Exercise' />}
                />
            </Grid>
            <Grid xs={12}>
                <StyledDivider />
            </Grid>
            <Grid container xs={12} md={9} spacing={2}>
                <Grid xs={6}>
                    <Stack spacing={2}>
                        <TextField
                            required
                            label='Name'
                            error={isNameError}
                            disabled={!exercise} //todo: is there really not a way to disable the whole form at once?
                            helperText={dirtyNameValidity?.reason || INVISIBLE_HELPER_TEXT}
                            value={dirtyExercise?.name || ''} //this has to be an empty string, not null, or it gets buggy with stale data when unselecting an exercise
                            InputLabelProps={{ shrink: !!dirtyExercise?.name }}
                            onChange={(e) => handleDirtyNameChange(e.target.value)}
                        />
                        <StatusInput
                            status={dirtyExercise?.status}
                            handleChange={handleStatusChange}
                        />
                        <ModifiersInput
                            selectedModifiers={dirtyExercise?.validModifiers}
                            handleChange={handleModifiersChange}
                        />
                    </Stack>
                </Grid>
                <Grid xs={6}>
                    {/* todo: center text? outline? divider style in the middle? */}
                    <Divider textAlign='center'>
                        Cues
                    </Divider>
                    {/* todo: Component for each ListItem. drag n drop? */}
                    <Button
                        disabled={!exercise}
                        onClick={() => setDirtyExercise({ ...dirtyExercise, cues: ['', ...dirtyExercise.cues] })}
                    >
                        Add
                    </Button>
                    <Stack spacing={2}>
                        {dirtyExercise?.cues.map((cue, i) => (
                            <CuesInput
                                key={i}
                                index={i}
                                value={cue}
                                handleDelete={handleDeleteCue}
                                handleUpdate={handleCueUpdate}
                            />))}
                    </Stack>

                </Grid>
            </Grid>
            <Grid xs={12}>
                <TextField
                    multiline
                    fullWidth
                    disabled={!exercise}
                    value={dirtyExercise?.notes || ''}
                    onChange={(e) => setDirtyExercise({ ...dirtyExercise, notes: e.target.value })}
                    label='Notes'
                />
            </Grid>
            <Grid xs={12}>
                <Button onClick={handleReset} disabled={!exercise}>Reset</Button>
                {/* todo: disable when no changes */}
                <Button variant='contained' disabled={!exercise || isNameError} onClick={handleSubmit}>Save Changes</Button>
            </Grid>
        </Grid >
    )

}