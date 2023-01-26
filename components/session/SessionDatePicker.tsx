import { Badge, TextField } from '@mui/material'
import {
  CalendarPickerSkeleton,
  DatePicker,
  PickersDay,
} from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import { useSessionLogs } from '../../lib/frontend/restService'

interface Props {
  date?: Dayjs | null
}
export default function SessionDatePicker(props: Props) {
  const [date, setDate] = useState(props.date)
  const [month, setMonth] = useState(props.date)
  const router = useRef(useRouter())
  const { sessionLogsIndex, isLoading } = useSessionLogs({
    start: month?.startOf('month').format(DATE_FORMAT),
    end: month?.endOf('month').format(DATE_FORMAT),
  })

  useEffect(() => {
    console.log(sessionLogsIndex)
  }, [sessionLogsIndex])

  useEffect(() => {
    if (date?.isValid()) {
      // can either useRef here or add router to dep array
      // not sure which is better. I don't know why router would ever change value
      router.current.push(`/sessions/${date.format(DATE_FORMAT)}`)
    }
  }, [date])

  return (
    <DatePicker
      label="Date"
      value={date}
      onChange={(newDate) => setDate(newDate)}
      renderInput={(params) => <TextField {...params} fullWidth />}
      onMonthChange={(newMonth) => setMonth(newMonth)}
      loading={isLoading}
      renderLoading={() => <CalendarPickerSkeleton />}
      renderDay={(dayjs, _selectedDays, DayComponentProps) => {
        const date = dayjs?.format(DATE_FORMAT) ?? ''
        return (
          <Badge
            key={date}
            overlap="circular"
            badgeContent={sessionLogsIndex[date] ? '🌚' : undefined}
          >
            <PickersDay {...DayComponentProps} />
          </Badge>
        )
      }}
    />
  )
}
