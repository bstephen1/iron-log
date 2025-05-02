import { Badge, type TextFieldProps } from '@mui/material'
import {
  DatePicker,
  DayCalendarSkeleton,
  PickersDay,
} from '@mui/x-date-pickers'
import { type Dayjs } from 'dayjs'
import { useState } from 'react'
import { preload } from 'swr'
import { DATE_FORMAT, URI_SESSIONS } from '../../../lib/frontend/constants'
import { paramify, useSessionLogs } from '../../../lib/frontend/restService'
import { swrFetcher } from '../../../lib/util'
import useCurrentSessionLog from '../useCurrentSessionLog'

// The query gets data for the current month +/- 1 month so that
// data for daysOutsideCurrentMonth is still visible on the current month
const buildSessionLogQuery = (relativeMonth: number, day: Dayjs) => ({
  limit: 0,
  start: day
    .startOf('month')
    .add(relativeMonth - 1, 'month')
    .format(DATE_FORMAT),
  end: day
    .endOf('month')
    .add(relativeMonth + 1, 'month')
    .format(DATE_FORMAT),
})

/** Preload adjacent months in useSWR's cache.
 *  The cache uses the same api uri as the key, so we need to build the same query that the
 * currently selected month will use instead of widening the range.
 */
const fetchNearbyMonths = (newMonth: Dayjs) => {
  // preload() apparently only works client side. If called server side it complains about absolute url.
  if (typeof window === 'undefined') return

  const prev = buildSessionLogQuery(-1, newMonth)
  const next = buildSessionLogQuery(1, newMonth)
  preload(URI_SESSIONS + paramify({ ...prev }), swrFetcher)
  preload(URI_SESSIONS + paramify({ ...next }), swrFetcher)
}

interface Props {
  day: Dayjs
  /** Triggered when the picker value changes to a new date.
   *  Guaranteed to only trigger when the date is valid.
   */
  handleDayChange: (day: Dayjs) => void
  label?: string
  textFieldProps?: Omit<TextFieldProps, 'slotProps'>
}
export default function SessionDatePicker(props: Props) {
  return (
    <SessionDatePickerInner key={props.day.format(DATE_FORMAT)} {...props} />
  )
}

function SessionDatePickerInner({
  day,
  label = 'Date',
  textFieldProps,
  handleDayChange,
}: Props) {
  // You can type freely in a DatePicker. pickerValue updates on input change,
  // and only triggers handleDateChange when pickerValue changes to a valid date.
  const [pickerValue, setPickerValue] = useState<Dayjs | null>(day)
  const [visibleMonth, setVisibleMonth] = useState(day)
  const { sessionLogsIndex, isLoading } = useSessionLogs(
    buildSessionLogQuery(0, visibleMonth)
  )
  const { records: currentRecords, sessionLog: currentSession } =
    useCurrentSessionLog()

  const handleChange = (newPickerValue: Dayjs | null) => {
    if (newPickerValue?.isValid()) {
      handleDayChange(newPickerValue)
    }
    setPickerValue(newPickerValue)
  }

  // Prefetch on init
  fetchNearbyMonths(day)

  // todo: If using arrow keys while picker is open it should stop propagation so the underlying swiper doesn't move too.
  // todo: can add background colors for meso cycles: https://mui.com/x/react-date-pickers/date-picker/#customized-day-rendering
  return (
    <DatePicker
      showDaysOutsideCurrentMonth
      closeOnSelect // default is true for desktop, false for mobile
      label={label}
      value={pickerValue}
      onChange={handleChange}
      slotProps={{
        textField: textFieldProps,
        field: {
          clearable: true,
        },
      }}
      // onChange only changes when a new date is actually selected.
      // onMonthChange changes when the visible month in the calendar changes.
      onMonthChange={(newMonth) => {
        fetchNearbyMonths(newMonth)
        setVisibleMonth(newMonth)
      }}
      loading={isLoading}
      renderLoading={() => <DayCalendarSkeleton />}
      // apparently this needs PickersDayProps' type defined to infer types for the other args
      slots={{
        day: (DayComponentProps) => {
          const day = DayComponentProps.day.format(DATE_FORMAT)
          // the index will not be updated for the current day if user creates a new
          // session by creating a record
          const isCurrentDay = day === currentSession?.date
          const isBadgeVisible = isCurrentDay
            ? currentRecords?.length
            : sessionLogsIndex[day]?.records.length
          // todo: can populate this with more info, like session type (after that's implemented)
          return (
            <Badge
              key={day}
              overlap="circular"
              variant="dot"
              color="secondary"
              aria-label={`${day}, ${
                isBadgeVisible ? 'Session data exists' : 'No session data'
              }`}
              invisible={!isBadgeVisible}
            >
              <PickersDay {...DayComponentProps} />
            </Badge>
          )
        },
      }}
    />
  )
}
