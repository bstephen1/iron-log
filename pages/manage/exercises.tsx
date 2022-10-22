import {
  Autocomplete,
  CircularProgress,
  createFilterOptions,
  TextField,
} from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useState } from 'react'
import ExerciseForm from '../../components/exercise-form/ExerciseForm'
import { ExerciseFormProvider } from '../../components/exercise-form/useExerciseForm'
import StyledDivider from '../../components/StyledDivider'
import { updateExercise, useExercises } from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatusOrder } from '../../models/ExerciseStatus'

//todo: disable form stuff when no changes
//todo: ui element showing "changes saved". Snackbar?
//todo: add/delete exercise. Delete only for unused exercises?
//todo: filter exercise list by status?
export default function ManageExercisesPage() {
  const { exercises, mutate } = useExercises()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [open, setOpen] = useState(false) //need this to show loading only while open
  const loading = !exercises && open
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

  //todo: move autocomplete to a component for this + session view
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
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          loading={loading}
          loadingText="Loading..."
          options={
            exercises?.sort(
              (a, b) =>
                ExerciseStatusOrder[a.status] - ExerciseStatusOrder[b.status]
            ) || []
          }
          groupBy={(option) => option.status}
          value={exercise}
          onChange={(e, option) =>
            option && !('_id' in option)
              ? setExercise(new Exercise(option.name))
              : setExercise(option)
          }
          getOptionLabel={(option) => option.name}
          filterOptions={(options, params) => {
            //was going to pull this out to a separate function but the param type definitions are long and annoying
            const filtered = filter(options, params)
            const { inputValue } = params

            //todo: filter based on status? add filtering adornment?

            //append an option to add the current input
            const isExisting = options.some(
              (option) => inputValue === option.name
            )
            if (inputValue && !isExisting) {
              filtered.push(new NewExerciseStub(inputValue))
            }

            return filtered
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Exercise"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
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
    </Grid>
  )
}
