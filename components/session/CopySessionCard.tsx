import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Button, Paper, Stack, Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import { useSwiper } from 'swiper/react'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import {
  addRecord,
  updateSessionLog,
  useRecords,
  useSessionLog,
} from '../../lib/frontend/restService'
import SessionLog from '../../models/SessionLog'
import SessionDatePicker from './upper/SessionDatePicker'
import useCurrentSessionLog from './useCurrentSessionLog'
import { createRecord } from '../../models/Record'

/** This component should be given key={date} so it can reset its state on date change */
export default function CopySessionCard() {
  const swiper = useSwiper()
  const { date, mutate } = useCurrentSessionLog()
  const day = dayjs(date)
  // may want to init as current day to prevent extra fetch,
  // or optimistically fetch most recent session of the same type
  const [prevDay, setPrevDay] = useState<Dayjs>(day.add(-7, 'day'))
  const { sessionLog: prevSessionLog, isLoading: isPrevSessionLoading } =
    useSessionLog(prevDay)
  const { sessionLog: curSessionLog, isLoading: isCurSessionLoading } =
    useSessionLog(day)
  const { recordsIndex, isLoading: isRecordLoading } = useRecords({
    date: prevDay.format(DATE_FORMAT),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSessionEmpty, setIsSessionEmpty] = useState(false)

  const handlePrevDayChange = (newPrevDay: Dayjs) => {
    // reset this so if you tried to copy an empty session the button comes back
    setIsSessionEmpty(false)
    setPrevDay(newPrevDay)
  }

  const waitForFetch = () => {
    if (isRecordLoading || isPrevSessionLoading || isCurSessionLoading) {
      setTimeout(waitForFetch, 100)
    }
  }

  const handleCopy = async () => {
    setIsLoading(true)

    // we need to wait after clicking the button, since the session type will
    // be selected on the fly
    waitForFetch()

    if (!prevSessionLog) {
      setIsSessionEmpty(true)
      setIsLoading(false)
      return
    }

    // need to check if the current day already has a session so _id isn't changed
    const newSessionLog = curSessionLog
      ? curSessionLog
      : new SessionLog(day.format(DATE_FORMAT))

    // We want the records to be added in sequence so they remain in order
    // See: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    for (const id of prevSessionLog.records) {
      const prevRecord = recordsIndex[id]
      // const newSets = createNewSets(prevRecord.sets, prevRecord.activeModifiers)
      const newRecord = createRecord(day.format(DATE_FORMAT), {
        ...prevRecord,
        notes: [],
      })

      await addRecord(newRecord)
      newSessionLog.records.push(newRecord._id)
    }

    mutate(updateSessionLog(newSessionLog), {
      optimisticData: newSessionLog,
      revalidate: false,
    })

    swiper.update()

    if (!newSessionLog.records.length) {
      setIsSessionEmpty(true)
    }
    setIsLoading(false)
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack spacing={2} alignItems="center">
        <SessionDatePicker
          day={prevDay}
          handleDayChange={handlePrevDayChange}
          textFieldProps={{ variant: 'standard' }}
        />
        {/* todo: assign session types to records, and add a selector here
         for latest X session */}
        {isSessionEmpty ? (
          <Typography> No session data to copy!</Typography>
        ) : (
          <Button
            loading={isLoading}
            loadingPosition="start"
            // if using loadingPosition, a startIcon is required
            startIcon={<ContentCopyIcon />}
            variant="contained"
            onClick={handleCopy}
          >
            Copy session
          </Button>
        )}
      </Stack>
    </Paper>
  )
}
