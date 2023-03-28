import { Badge, TextField } from '@mui/material'
import {
  CalendarPickerSkeleton,
  DatePicker,
  PickersDay,
} from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import { useSessionLogs } from '../../../lib/frontend/restService'

interface Props {
  date: Dayjs | null
  handleChange: (date: Dayjs | null) => void
}
export default function SessionDatePicker({ date, handleChange }: Props) {
  // month is still a full date, but it only updates whenever the month changes
  const [month, setMonth] = useState(date)
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

  const { sessionLogsIndex, isLoading } = useSessionLogs(
    buildSessionLogQuery(0)
  )

  // todo: can add background colors for meso cycles: https://mui.com/x/react-date-pickers/date-picker/#customized-day-rendering

  // Query the adjacent months to store them in the cache.
  // UseSwr's cache uses the api uri as the key, so we need to build the same query that the
  // currently selected month will use instead of widening the range.
  const _sessionLogsCachePrev = useSessionLogs(buildSessionLogQuery(-1))
  const _sessionLogsCacheNext = useSessionLogs(buildSessionLogQuery(1))

  return (
    <DatePicker
      showDaysOutsideCurrentMonth
      closeOnSelect // default is true for desktop, false for mobile
      label="Date"
      value={date}
      onChange={handleChange}
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
