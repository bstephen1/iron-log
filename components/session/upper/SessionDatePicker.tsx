import { Badge, TextField } from '@mui/material'
import {
  CalendarPickerSkeleton,
  DatePicker,
  PickersDay,
} from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import { useSessionLogs } from '../../../lib/frontend/restService'

interface Props {
  date?: Dayjs | null
}
export default function SessionDatePicker(props: Props) {
  const [date, setDate] = useState(props.date)
  const [month, setMonth] = useState(props.date)
  const router = useRef(useRouter())
  // The query gets data for the current month +/- 1 month so that
  // data for daysOutsideCurrentMonth is still visible on the current month
  const buildSessionLogQuery = (relativeMonth: number) => ({
    limit: 0,
    start: month
      ?.startOf('month')
      .add(relativeMonth - 1, 'month')
      .format(DATE_FORMAT),
    end: month
      ?.endOf('month')
      .add(relativeMonth + 1, 'month')
      .format(DATE_FORMAT),
  })

  useEffect(() => {
    setDate(props.date)
    // can't just use props.date because that "changes" every render since it's an object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.date?.format(DATE_FORMAT)])

  // todo: can add background colors for meso cycles: https://mui.com/x/react-date-pickers/date-picker/#customized-day-rendering

  const { sessionLogsIndex, isLoading } = useSessionLogs(
    buildSessionLogQuery(0)
  )

  // Query the adjacent months to store them in the cache.
  // UseSwr's cache uses the api uri as the key, so we need to build the same query that the
  // currently selected month will use instead of widening the range.
  const _sessionLogsCachePrev = useSessionLogs(buildSessionLogQuery(-1))
  const _sessionLogsCacheNext = useSessionLogs(buildSessionLogQuery(1))

  useEffect(() => {
    if (date?.isValid()) {
      // can either useRef here or add router to dep array
      // not sure which is better. I don't know why router would ever change value
      router.current.push(`/sessions/${date.format(DATE_FORMAT)}`)
    }
  }, [date])

  return (
    <DatePicker
      showDaysOutsideCurrentMonth
      closeOnSelect // default is true for desktop, false for mobile
      label="Date"
      value={date}
      onChange={(newDate) => setDate(newDate)}
      renderInput={(params) => <TextField {...params} fullWidth />}
      onMonthChange={(newMonth) => setMonth(newMonth)}
      loading={isLoading}
      renderLoading={() => <CalendarPickerSkeleton />}
      renderDay={(dayjs, _selectedDays, DayComponentProps) => {
        const day = dayjs?.format(DATE_FORMAT) ?? ''
        return (
          <Badge
            key={day}
            overlap="circular"
            variant="dot"
            color="secondary"
            invisible={!sessionLogsIndex[day]}
          >
            <PickersDay {...DayComponentProps} />
          </Badge>
        )
      }}
    />
  )
}
