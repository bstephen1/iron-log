import CheckIcon from '@mui/icons-material/Check'
import CalendarIcon from '@mui/icons-material/InsertInvitation'
import Badge from '@mui/material/Badge'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import type { TextFieldProps } from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import type { Dayjs } from 'dayjs'
import { useState } from 'react'
import {
  DATE_FORMAT,
  DATE_PICKER_FORMAT,
} from '../../../lib/frontend/constants'
import { useSessionLogs } from '../../../lib/frontend/restService'
import type FetchOptions from '../../../models/FetchOptions'
import TransitionIconButton from '../../TransitionIconButton'

// The query gets data for the current month +/- 1 month so that
// data for daysOutsideCurrentMonth is still visible on the current month
const buildSessionLogQuery = (
  relativeMonth: number,
  day: Dayjs
): FetchOptions => ({
  limit: 0,
  start: day
    .add(relativeMonth - 1, 'month')
    .startOf('month')
    .format(DATE_FORMAT),
  end: day
    .add(relativeMonth + 1, 'month')
    .endOf('month')
    .format(DATE_FORMAT),
})

interface Props {
  day: Dayjs
  /** Triggered when the picker value changes to a new date.
   *  Guaranteed to only trigger when the date is valid.
   */
  handleDayChange: (day: Dayjs) => void
  label?: string
  textFieldProps?: TextFieldProps
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
  const [open, setOpen] = useState(false)
  const [isChangingDay, setIsChangingDay] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(day)
  const sessionLogs = useSessionLogs(buildSessionLogQuery(0, visibleMonth))
  // preload adjacent months -- do each separately to keep a reusable cache key
  useSessionLogs(buildSessionLogQuery(-1, visibleMonth))
  useSessionLogs(buildSessionLogQuery(1, visibleMonth))

  const handleChange = (newPickerValue: Dayjs | null) => {
    setPickerValue(newPickerValue)
    // If the day was changed via the picker dialog, immediately submit the change.
    // Otherwise the change is coming via keyboard input, so we wait until the submit
    // button is clicked.
    if (open && newPickerValue) {
      handleSubmit(newPickerValue)
    }
  }

  const handleSubmit = (newDay: Dayjs) => {
    setIsChangingDay(true)
    handleDayChange(newDay)
  }

  const toggleOpen = () => setOpen(!open)

  return (
    <DatePicker
      showDaysOutsideCurrentMonth
      closeOnSelect // default is true for desktop, false for mobile
      open={open}
      onOpen={toggleOpen}
      onClose={toggleOpen}
      label={label}
      value={pickerValue}
      onChange={handleChange}
      slotProps={{
        popper: {
          // prevent swiper from swiping when selecting dates with arrow keys
          /* c8 ignore next */
          onKeyDown: (e) => e.key.match(/Arrow/) && e.stopPropagation(),
        },

        textField: {
          ...textFieldProps,
          onKeyDown: ({ key }) => {
            if (key === 'Enter') {
              pickerValue && handleSubmit(pickerValue)
            }
          },
          InputProps: {
            endAdornment: (
              // -12px is the margin for the default icon
              <Stack direction="row" mr="-12px">
                {isChangingDay ? (
                  <InputAdornment
                    position="end"
                    sx={{ width: '32px', mt: '4px' }}
                  >
                    <CircularProgress color="inherit" size={20} />
                  </InputAdornment>
                ) : (
                  <TransitionIconButton
                    isVisible={
                      pickerValue?.format(DATE_FORMAT) !==
                      day.format(DATE_FORMAT)
                    }
                    disabled={!pickerValue?.isValid()}
                    onClick={() => pickerValue && handleSubmit(pickerValue)}
                    aria-label="Confirm"
                    sx={{ pr: 0.5 }}
                  >
                    <CheckIcon />
                  </TransitionIconButton>
                )}
                {/* we have to reimplement the behavior of the default button.
                    Alternatively could move the calendar to a startAdornment with
                    the "field" slotProp */}
                <IconButton
                  onClick={toggleOpen}
                  aria-label={
                    'Choose date' +
                    (pickerValue
                      ? `, selected date is ${pickerValue.format('MMM D, YYYY')}`
                      : '')
                  }
                >
                  <CalendarIcon />
                </IconButton>
              </Stack>
            ),
          },
        },
      }}
      format={DATE_PICKER_FORMAT}
      // onChange only changes when a new date is actually selected.
      // onMonthChange changes when the visible month in the calendar changes.
      onMonthChange={(newMonth) => {
        setVisibleMonth(newMonth)
      }}
      loading={sessionLogs.isLoading}
      /* c8 ignore next */
      renderLoading={() => <DayCalendarSkeleton />}
      // apparently this needs PickersDayProps' type defined to infer types for the other args
      slots={{
        day: (DayComponentProps) => {
          const day = DayComponentProps.day.format(DATE_FORMAT)
          const isBadgeVisible = sessionLogs.index[day]?.records.length
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
