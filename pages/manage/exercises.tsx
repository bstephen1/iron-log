import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
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
    const filter = createFilterOptions<Exercise | NewExerciseStub>()

    //temporarily store the current input in a stub and only create a true Exercise if the stub is selected
    class NewExerciseStub {
        name: string
        status: string
        constructor(name: string) {
            this.name = name
            this.status = 'Add New'
        }
    }

    function handleSubmit(exercise: Exercise) {
        updateExercise(exercise)
        setExercise(exercise)
        mutate(exercises)
    }

    if (!exercises) {
        return <></>
    }

    //todo: when typing, if string becomes empty it disables the form, even if not submitted
    // todo: names should be case insensitive. 'Squats' === 'squats'
    return (
        <Grid container spacing={2}>
            <Grid xs={12} md={3}>
                <Autocomplete<Exercise | NewExerciseStub>
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    autoSelect
                    autoHighlight
                    options={exercises} //todo: should sort. localeCompare? Some kind of hardcoded list (eg, favorites > active > archived)?
                    groupBy={option => option.status}
                    value={exercise}
                    onChange={(e, option) => (option && !('_id' in option)) ? setExercise(new Exercise(option.name)) : setExercise(option)}
                    renderInput={(params) => <TextField {...params} label='Exercise' />}
                    getOptionLabel={option => option.name}
                    filterOptions={(options, params) => {
                        //was going to pull this out to a separate function but the param type definitions are long and annoying
                        const filtered = filter(options, params)
                        const { inputValue } = params

                        //todo: filter based on status? add filtering adornment?

                        //append an option to add the current input
                        const isExisting = options.some((option) => inputValue === option.name)
                        if (inputValue && !isExisting) {
                            filtered.push(new NewExerciseStub(inputValue))
                        }

                        return filtered
                    }}
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