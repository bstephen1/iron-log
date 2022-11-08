import { Button, Paper, Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import {
  addRecord,
  updateSession,
  useExercises,
  useSession,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import Record from '../../models/Record'
import { ExerciseSelector } from '../form-fields/ExerciseSelector'
import Clock from './Clock'
import RecordInput from './RecordInput'
import TitleBar from './TitleBar'

export default function SessionView({ date }: { date: Dayjs }) {
  const { session, isError, mutate } = useSession(date)
  const { exercises } = useExercises({ status: ExerciseStatus.ACTIVE }) // SWR caches this, so it won't need to call the API every render
  const [exercise, setExercise] = useState<Exercise | null>(null)
  // when the record is empty it will be null, but if it still hasn't returned yet it will be undefined
  // it looks offputting putting a skeleton in when loading since there can be any number of exerciseRecords,
  // so for now we just hide the add exercise button so the records don't pop in above it
  const isLoading = session === undefined || !exercises

  // todo: this is a placeholder
  if (isError) {
    return <>Error fetching data!</>
  }

  // todo: have an extra card for adding? Like Add Cue? Or just an input for the name with a submit button?
  const handleAddRecord = () => {
    if (isLoading) return // make typescript happy

    const record = new Record(date.format(DATE_FORMAT), exercise)
    addRecord(record)
    // todo: updateSessionField
    const newSession = {
      ...session,
      records: session.records.concat(record._id),
    }
    updateSession(newSession)
    mutate(newSession)
  }

  const handleDeleteRecord = (idToDelete) => {
    const newRecords = session?.records.filter((id) => id !== idToDelete)
    updateSession({ ...session, records: newRecords })
    mutate({ ...session, records: newRecords })
  }

  // todo: compare with last of this day type
  // todo: drag and drop (react-beautiful-dnd?) mongo stores array ordered so dnd can just return a new object with the new order (rather than introducing IDs for subarrays)
  return (
    <Grid container spacing={2} direction="column">
      <Grid>
        <TitleBar date={date} />
      </Grid>
      <Grid>
        <Clock />
      </Grid>
      {/* todo: session only handles updating index order */}
      {session &&
        session.records.map((id) => (
          <Grid key={id}>
            <RecordInput id={id} deleteRecord={handleDeleteRecord} />
          </Grid>
        ))}

      <Grid>
        {/* maybe make this a card with CardHeader */}

        {!isLoading && (
          <Paper elevation={3} sx={{ p: 2, my: 2 }}>
            <Stack direction="row" spacing={2}>
              <ExerciseSelector
                fullWidth
                variant="standard"
                {...{
                  exercise,
                  exercises,
                  changeExercise: (newExercise) => setExercise(newExercise),
                }}
              />
              <Button
                variant="contained"
                sx={{ width: 250 }}
                onClick={handleAddRecord}
              >
                Add Exercise
              </Button>
            </Stack>
          </Paper>
        )}
      </Grid>
    </Grid>
  )
}
