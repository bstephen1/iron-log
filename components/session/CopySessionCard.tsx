import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import dayjs, { type Dayjs } from 'dayjs'
import { useCallback, useState } from 'react'
import { useSwiper } from 'swiper/react'
import { useCurrentDate } from '../../app/sessions/[date]/useCurrentDate'
import { addRecord } from '../../lib/backend/mongoService'
import { DATE_FORMAT, QUERY_KEYS } from '../../lib/frontend/constants'
import {
  dbAdd,
  useRecords,
  useSessionLog,
} from '../../lib/frontend/restService'
import { createRecord } from '../../models/Record'
import SessionDatePicker from './upper/SessionDatePicker'

/** This component should be given key={date} so it can reset its state on date change */
export default function CopySessionCard() {
  const swiper = useSwiper()
  const date = useCurrentDate()
  const day = dayjs(date)
  // may want to init as current day to prevent extra fetch,
  // or optimistically fetch most recent session of the same type
  const [prevDay, setPrevDay] = useState<Dayjs>(day.add(-7, 'day'))
  const prevSessionLog = useSessionLog(prevDay)
  const prevRecords = useRecords({
    date: prevDay.format(DATE_FORMAT),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSessionEmpty, setIsSessionEmpty] = useState(false)

  const handlePrevDayChange = (newPrevDay: Dayjs) => {
    // reset this so if you tried to copy an empty session the button comes back
    setIsSessionEmpty(false)
    setPrevDay(newPrevDay)
  }

  const handleCopy = useCallback(async () => {
    setIsLoading(true)

    if (!prevSessionLog.data) {
      setIsSessionEmpty(true)
      setIsLoading(false)
      return
    }

    // We want the records to be added in sequence so they remain in order
    // See: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    for (const id of prevSessionLog.data.records) {
      const prevRecord = prevRecords.index[id]
      const newRecord = createRecord(date, {
        ...prevRecord,
        notes: [],
      })

      dbAdd({
        queryKey: [QUERY_KEYS.records, { date }],
        newItem: newRecord,
        addFunction: addRecord,
        errorMessage:
          'Previous session has a corrupt record. Could not finish copying the session.',
      })
    }

    swiper.update()

    setIsLoading(false)
  }, [date, prevRecords.index, prevSessionLog.data, swiper])

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack spacing={2} alignItems="center">
        <SessionDatePicker
          label="Previous session"
          day={prevDay}
          handleDayChange={handlePrevDayChange}
          textFieldProps={{ variant: 'standard', fullWidth: true }}
        />
        {/* todo: assign session types to records, and add a selector here
         for latest X session */}
        {isSessionEmpty ? (
          <Typography> No session data to copy!</Typography>
        ) : (
          <Button
            loading={
              isLoading || prevSessionLog.isLoading || prevRecords.isLoading
            }
            loadingPosition="start"
            // if using loadingPosition, a startIcon is required
            startIcon={<ContentCopyIcon />}
            variant="contained"
            onClick={handleCopy}
            sx={{ width: 200 }}
          >
            Copy session
          </Button>
        )}
      </Stack>
    </Paper>
  )
}
