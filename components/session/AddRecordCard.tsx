import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import { useSwiper } from 'swiper/react'
import { useCurrentDate } from '../../app/sessions/[date]/useCurrentDate'
import ExerciseSelector from '../../components/form-fields/selectors/ExerciseSelector'
import { addRecord } from '../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../lib/frontend/constants'
import { dbAdd } from '../../lib/frontend/restService'
import { type Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { createRecord } from '../../models/Record'

export default function AddRecordCard() {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const date = useCurrentDate()
  const swiper = useSwiper()

  const handleAdd = async () => {
    if (!exercise) return

    await dbAdd({
      optimisticKey: [QUERY_KEYS.records, { date }],
      newItem: createRecord(date, { exercise }),
      addFunction: addRecord,
      errorMessage: `The exercise is corrupt and can't be used to create records.`,
    })

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
            categoryFilter: category,
            handleCategoryFilterChange: setCategory,
          }}
        />
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={handleAdd}
          disabled={!exercise}
        >
          Add Record
        </Button>
      </Stack>
    </Paper>
  )
}
