import { Button, Paper, Stack } from '@mui/material'
import { useState } from 'react'
import { useSwiper } from 'swiper/react'
import { useSWRConfig } from 'swr'
import ExerciseSelector from '../../components/form-fields/selectors/ExerciseSelector'
import { addRecord, useExercises } from '../../lib/frontend/restService'
import { enqueueError } from '../../lib/util'
import { Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { createRecord } from '../../models/Record'
import { createSessionLog } from '../../models/SessionLog'
import useCurrentSessionLog from './useCurrentSessionLog'

export default function AddRecordCard() {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const { mutate } = useSWRConfig()
  const { exercises, mutate: mutateExercises } = useExercises()
  const { sessionLog, date, mutate: mutateSession } = useCurrentSessionLog()
  const swiper = useSwiper()

  const handleAdd = async () => {
    if (!exercise) return

    const newRecord = createRecord(date, { exercise })
    try {
      await addRecord(newRecord)
    } catch (e) {
      enqueueError(
        e,
        `The exercise is corrupt and can't be used to create records.`
      )
      return
    }
    const newSessionLog = sessionLog ?? createSessionLog(date)

    // Add new record to swr cache so it doesn't have to be fetched.
    mutate(`/api/records/${newRecord._id}`, newRecord, {
      revalidate: false,
      optimisticData: newRecord,
    })
    mutateSession({
      ...newSessionLog,
      records: newSessionLog.records.concat(newRecord._id),
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
