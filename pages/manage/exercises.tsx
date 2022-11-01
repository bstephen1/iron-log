import {
  Autocomplete,
  CircularProgress,
  createFilterOptions,
  TextField,
} from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useState } from 'react'
import ExerciseForm from '../../components/exercise-form/ExerciseForm'
import ManageWelcomeCard from '../../components/ManageWelcomeCard'
import StyledDivider from '../../components/StyledDivider'
import {
  addExercise,
  updateExerciseField,
  useExercises,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatusOrder } from '../../models/ExerciseStatus'

// todo: disable form stuff when no changes
// todo: ui element showing "changes saved". Snackbar?
// todo: add/delete exercise. Delete only for unused exercises?
// todo: filter exercise list by status?
export default function ManageExercisesPage() {
  const { exercises, mutate } = useExercises()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [open, setOpen] = useState(false) // need this to show loading only while open
  const loading = !exercises && open
  const filter = createFilterOptions<Exercise | NewExerciseStub>()

  // temporarily store the current input in a stub and only create a true Exercise if the stub is selected
  class NewExerciseStub {
    name: string
    status: string
    constructor(name: string) {
      this.name = name
      this.status = 'Add New'
    }
  }

  const handleUpdate = <T extends keyof Exercise>(
    field: T,
    value: Exercise[T]
  ) => {
    if (!exercise) return

    console.log(`updating ${field}: ${value}`)
    const newExercise = { ...exercise, [field]: value }
    updateExerciseField(exercise, field, value)
    // todo: not sure I like this... can we just mutate the selected exercise?
    const newExercises = exercises?.map((exercise) =>
      exercise._id === newExercise._id ? newExercise : exercise
    )
    mutate(newExercises)
    setExercise(newExercise)
  }

  // todo: move autocomplete to a component for this + session view
  // todo: when typing, if string becomes empty it disables the form, even if not submitted
  // todo: names should be case insensitive. 'Squats' === 'squats'
  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={3}>
        <Autocomplete<Exercise | NewExerciseStub>
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          autoHighlight
          isOptionEqualToValue={(a, b) => a.name === b.name}
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
          onChange={(_, option) => {
            if (option && !('_id' in option)) {
              const newExercise = new Exercise(option.name)
              mutate(exercises?.concat(newExercise))
              addExercise(newExercise)
              setExercise(newExercise)
            } else {
              setExercise(option)
            }
          }}
          getOptionLabel={(option) => option.name}
          filterOptions={(options, params) => {
            // was going to pull this out to a separate function but the param type definitions are long and annoying
            const filtered = filter(options, params)
            const { inputValue } = params

            // todo: filter based on status? add filtering adornment?

            // append an option to add the current input
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
      <Grid container xs={12} md={8} justifyContent="center">
        {exercise ? (
          <ExerciseForm exercise={exercise} handleUpdate={handleUpdate} />
        ) : (
          <ManageWelcomeCard />
        )}
      </Grid>
    </Grid>
  )
}
