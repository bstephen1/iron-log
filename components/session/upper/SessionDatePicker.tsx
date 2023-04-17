import { Badge, TextField, TextFieldProps } from '@mui/material'
import {
  CalendarPickerSkeleton,
  DatePicker,
  PickersDay,
} from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import { DATE_FORMAT, URI_SESSIONS } from 'lib/frontend/constants'
import { paramify, useSessionLogs } from 'lib/frontend/restService'
import { swrFetcher } from 'lib/util'
import { useEffect, useState } from 'react'
import { preload } from 'swr'

// The query gets data for the current month +/- 1 month so that
// data for daysOutsideCurrentMonth is still visible on the current month
const buildSessionLogQuery = (relativeMonth: number, month: Dayjs) => ({
  limit: 0,
  start: month
    .startOf('month')
    .add(relativeMonth - 1, 'month')
    .format(DATE_FORMAT),
  end: month
    .endOf('month')
    .add(relativeMonth + 1, 'month')
    .format(DATE_FORMAT),
})

interface Props {
  date: Dayjs
  /** Triggered when the picker value changes to a new date.
   *  Guaranteed to only trigger when the date is valid.
   */
  handleDateChange: (date: Dayjs) => void
  label?: string
  textFieldProps?: TextFieldProps
}
export default function SessionDatePicker({
  date,
  label = 'Date',
  textFieldProps,
  handleDateChange,
}: Props) {
  // You can type freely in a DatePicker. pickerValue updates on input change,
  // and only triggers handleDateChange when pickerValue changes to a valid date.
  const [pickerValue, setPickerValue] = useState<Dayjs | null>(date)
  // month is still a full date, but it only updates whenever the month changes
  const [month, setMonth] = useState(date)

  const { sessionLogsIndex, isLoading } = useSessionLogs(
    buildSessionLogQuery(0, month)
  )

  useEffect(() => {
    setPickerValue(date)
  }, [date])

  const handleChange = (newPickerValue: Dayjs | null) => {
    if (newPickerValue?.isValid()) {
      handleDateChange(newPickerValue)
    }
    setPickerValue(newPickerValue)
  }

  // todo: can add background colors for meso cycles: https://mui.com/x/react-date-pickers/date-picker/#customized-day-rendering

  // Preload adjacent months in useSWR's cache.
  // The cache uses the api uri as the key, so we need to build the same query that the
  // currently selected month will use instead of widening the range.
  useEffect(() => {
    const prev = buildSessionLogQuery(-1, month)
    const next = buildSessionLogQuery(1, month)
    preload(URI_SESSIONS + paramify({ ...prev }), swrFetcher)
    preload(URI_SESSIONS + paramify({ ...next }), swrFetcher)
  }, [month])

  return (
    <DatePicker
      showDaysOutsideCurrentMonth
      closeOnSelect // default is true for desktop, false for mobile
      label={label}
      value={pickerValue}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          InputLabelProps={{
            ...params.InputLabelProps,
            ...textFieldProps?.InputLabelProps,
            shrink: true,
          }}
        />
      )}
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
            invisible={!sessionLogsIndex[day]?.records.length}
          >
            <PickersDay {...DayComponentProps} />
          </Badge>
        )
      }}
    />
  )
}
