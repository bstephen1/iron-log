import { Button } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { Dayjs } from 'dayjs'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import {
  createSession,
  updateSession,
  useSession,
} from '../../lib/frontend/restService'
import Record from '../../models/Record'
import Session from '../../models/Session'
import Clock from './Clock'
import RecordInput from './RecordInput'
import TitleBar from './TitleBar'

export default function SessionView({ date }: { date: Dayjs }) {
  const { session, isError, mutate } = useSession(date)
  // when the record is empty it will be null, but if it still hasn't returned yet it will be undefined
  // it looks offputting putting a skeleton in when loading since there can be any number of exerciseRecords,
  // so for now we just hide the add exercise button so the records don't pop in above it
  const isLoading = session === undefined

  // todo: have an extra card for adding? Like Add Cue? Or just an input for the name with a submit button?
  const addRecord = async () => {
    // let newSession
    // if (!session) {
    //   newSession = new Session(date.format(DATE_FORMAT), [new Record()])
    //   await createSession(newSession)
    // } else {
    //   newSession = { ...session, records: [...session.records, new Record()] }
    //   await updateSession(newSession)
    // }
    // // mutate is like useState for the useSWR hook. It changes the local value, then refetches the data to confirm it has updated
    // mutate(newSession)
  }

  // todo: this is a placeholder
  if (isError) {
    return <>Error fetching data!</>
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
            <RecordInput id={id} />
          </Grid>
        ))}

      <Grid container justifyContent="center">
        {!isLoading && (
          <Button variant="contained" onClick={addRecord}>
            Add Exercise
          </Button>
        )}
      </Grid>
    </Grid>
  )
}
