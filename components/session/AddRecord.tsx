import { Button, Paper, Stack } from '@mui/material'
import { useState } from 'react'
import { useExercises } from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import { ExerciseSelector } from '../form-fields/selectors/ExerciseSelector'

interface Props {
  handleAdd: (exercise: Exercise) => void
}
export default function AddRecord(props: Props) {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const { exercises, mutate: mutateExercises } = useExercises({
    status: ExerciseStatus.ACTIVE,
  })

  const handleAdd = () => {
    if (!exercise) return

    props.handleAdd(exercise)

    setExercise(null)
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack spacing={2} alignItems="center">
        <ExerciseSelector
          fullWidth
          variant="standard"
          {...{
            exercise,
            exercises,
            handleChange: (newExercise) => setExercise(newExercise),
            mutate: mutateExercises,
          }}
        />
        <Button variant="contained" sx={{ width: 250 }} onClick={handleAdd}>
          Add Record
        </Button>
      </Stack>
    </Paper>
  )
}
