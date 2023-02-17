import { LoadingButton } from '@mui/lab'
import { Paper, Stack, Typography } from '@mui/material'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { useSwiper } from 'swiper/react'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import {
  addRecord,
  useRecords,
  useSessionLog,
} from '../../lib/frontend/restService'
import Record from '../../models/Record'
import SessionLog from '../../models/SessionLog'
import { Set } from '../../models/Set'

interface Props {
  handleAddSession: (sessionLog: SessionLog) => void
  date: Dayjs
}
export default function CopySessionCard({ date, ...props }: Props) {
  const swiper = useSwiper()
  // may want to init as current day to prevent extra fetch,
  // or optimistically fetch most recent session of the same type
  const prevDate = date.add(-7, 'day')
  const { sessionLog: prevSessionLog, isLoading: isSessionLoading } =
    useSessionLog(prevDate)
  const { recordsIndex, isLoading: isRecordLoading } = useRecords({
    date: prevDate.format(DATE_FORMAT),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSessionEmpty, setIsSessionEmpty] = useState(false)

  const waitForFetch = () => {
    if (isRecordLoading || isSessionLoading) {
      setTimeout(waitForFetch, 100)
    }
  }

  const handleCopy = async () => {
    setIsLoading(true)

    // we need to wait after clicking the button, since the session type will
    // be selected on the fly
    waitForFetch()

    // the type for these isn't showing null somehow, but sessionlog CAN be null
    if (!recordsIndex || !prevSessionLog) {
      setIsSessionEmpty(true)
      setIsLoading(false)
      return
    }

    // records are ordered via the sessionLog array
    const newSessionLog = new SessionLog(date.format(DATE_FORMAT))

    // for-await-of construct must be used to ensure the await works properly.
    // See: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    for await (const id of prevSessionLog.records) {
      const prevRecord = recordsIndex[id]
      // const newSets = createNewSets(prevRecord.sets, prevRecord.activeModifiers)
      const newRecord = new Record(date.format(DATE_FORMAT), {
        ...prevRecord,
        notes: [],
      })

      await addRecord(newRecord)
      newSessionLog.records.push(newRecord._id)
    }
    props.handleAddSession(newSessionLog)
    swiper.update()

    if (!newSessionLog.records.length) {
      setIsSessionEmpty(true)
    }
    setIsLoading(false)
  }

  // Unused. Trying out copying sets as-is and seeing how that plays out in practice.
  const createNewSets = (prevSets: Set[], modifiers: string[]) => {
    // todo: avoid hardcoding
    if (modifiers.includes('myo')) {
      // for myo only copy the first set
      const prevSet = prevSets[0]
      return [{ weight: prevSet.weight, reps: prevSet.reps }]
    }

    // Copy everything but the effort.
    return prevSets.map((set) => ({ ...set, effort: undefined }))
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack spacing={2} alignItems="center">
        {/* todo: assign session types to records, and add a selector here
         for latest X session */}
        {isSessionEmpty ? (
          <Typography> No previous session data!</Typography>
        ) : (
          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            variant="contained"
            onClick={handleCopy}
            // without a set width, loading spinner overlaps text
            sx={{ width: 300 }}
          >
            Copy last week's session
          </LoadingButton>
        )}
      </Stack>
    </Paper>
  )
}
