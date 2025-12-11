import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import { useSwiper } from 'swiper/react'
import { useCurrentDate } from '../../app/sessions/[date]/useCurrentDate'
import ExerciseSelector from '../../components/form-fields/selectors/ExerciseSelector'
import { addRecord } from '../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../lib/frontend/constants'
import { useAddMutation } from '../../lib/frontend/restService'
import type { Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { createRecord } from '../../models/Record'

export default function AddRecordCard() {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const date = useCurrentDate()
  const swiper = useSwiper()
  const addRecordMutate = useAddMutation({
    queryKey: [QUERY_KEYS.records, { date }],
    addFn: addRecord,
  })
  const handleAdd = async () => {
    addRecordMutate(createRecord(date, { exercise }))

    swiper.update()
    setExercise(null)
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack spacing={2} alignItems="center">
        <ExerciseSelector
          variant="standard"
          {...{
            exercise,
            handleChange: (newExercise) => setExercise(newExercise),
          }}
        />
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={handleAdd}
          disabled={!exercise}
        >
          Add record
        </Button>
      </Stack>
    </Paper>
  )
}
