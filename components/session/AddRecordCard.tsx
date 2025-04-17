import { Button, Paper, Stack } from '@mui/material'
import { useState } from 'react'
import { useSwiper } from 'swiper/react'
import { useSWRConfig } from 'swr'
import ExerciseSelector from '../../components/form-fields/selectors/ExerciseSelector'
import {
  addRecord,
  updateSessionLog,
  useExercises,
} from '../../lib/frontend/restService'
import { Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { createRecord } from '../../models/Record'
import useCurrentSessionLog from './useCurrentSessionLog'
import { createSessionLog } from '../../models/SessionLog'

export default function AddRecordCard() {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const { mutate } = useSWRConfig()
  const { exercises, mutate: mutateExercises } = useExercises()
  const { sessionLog, date, mutate: mutateSession } = useCurrentSessionLog()
  const swiper = useSwiper()

  const handleAdd = () => {
    if (!exercise) return

    const newRecord = createRecord(date, { exercise })
    const newSessionLog = sessionLog
      ? {
          ...sessionLog,
          records: sessionLog.records.concat(newRecord._id),
        }
      : createSessionLog(date, [newRecord._id])

    mutateSession(updateSessionLog(newSessionLog), {
      optimisticData: newSessionLog,
      revalidate: false,
    })
    // Add new record to swr cache so it doesn't have to be fetched.
    mutate(`/api/records/${newRecord._id}`, addRecord(newRecord), {
      revalidate: false,
      optimisticData: newRecord,
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
            exercises,
            handleChange: (newExercise) => setExercise(newExercise),
            mutate: mutateExercises,
            category,
            handleCategoryChange: setCategory,
          }}
        />
        <Button
          variant="contained"
          sx={{ width: 250 }}
          onClick={handleAdd}
          disabled={!exercise}
        >
          Add Record
        </Button>
      </Stack>
    </Paper>
  )
}
