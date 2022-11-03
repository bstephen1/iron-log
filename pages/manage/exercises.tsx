import Grid from '@mui/system/Unstable_Grid'
import { useState } from 'react'
import ExerciseForm from '../../components/exercise-form/ExerciseForm'
import { ExerciseSelector } from '../../components/ExerciseSelector'
import ManageWelcomeCard from '../../components/ManageWelcomeCard'
import StyledDivider from '../../components/StyledDivider'
import {
  updateExerciseField,
  useExercises,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'

// todo: disable form stuff when no changes
// todo: ui element showing "changes saved". Snackbar?
// todo: add/delete exercise. Delete only for unused exercises?
// todo: filter exercise list by status?
export default function ManageExercisesPage() {
  const { exercises, mutate } = useExercises()
  const [exercise, setExercise] = useState<Exercise | null>(null)

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
        {/* @ts-ignore  withAsync() has renderInput prop */}
        <ExerciseSelector
          {...{ exercise, setExercise, options: exercises, mutate }}
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
