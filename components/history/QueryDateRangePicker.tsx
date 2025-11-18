import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { DATE_FORMAT, DATE_PICKER_FORMAT } from '../../lib/frontend/constants'
import type { PartialUpdate } from '../../lib/types'
import type { RecordQuery } from '../../models/Record'

const today = dayjs()
const todayFormatted = dayjs().format(DATE_FORMAT)

const getQuickPick = (months: number) =>
  today.add(-months, 'months').format(DATE_FORMAT)
interface Props {
  query: RecordQuery
  updateQuery: PartialUpdate<RecordQuery>
}
export default function QueryDateRangePicker({ query, updateQuery }: Props) {
  const { start, end } = query
  const isCustom = start && end
  const value = isCustom ? 'custom' : (query.start ?? 'none')

  const handleQuickMonthChange = (option: string) => {
    if (option === 'custom') {
      updateQuery({ start: todayFormatted, end: todayFormatted })
    } else if (option === 'none') {
      updateQuery({ start: undefined, end: undefined })
    } else {
      updateQuery({
        start: option,
        end: undefined,
      })
    }
  }
  return (
    <>
      <TextField
        label="Date range"
        select
        value={value}
        onChange={(e) => handleQuickMonthChange(e.target.value)}
        slotProps={{
          select: { displayEmpty: true },
          inputLabel: { shrink: true },
        }}
      >
        <MenuItem value={getQuickPick(3)}>Last 3 months</MenuItem>
        <MenuItem value={getQuickPick(6)}>Last 6 months</MenuItem>
        <MenuItem value={getQuickPick(12)}>Last year</MenuItem>
        <MenuItem value="none">No filter</MenuItem>
        <MenuItem value="custom">Custom</MenuItem>
      </TextField>
      {isCustom && (
        <Stack direction="row" spacing={2}>
          <QueryDatePicker
            label="Start date"
            date={start}
            upDate={(start) => updateQuery({ start })}
          />
          <QueryDatePicker
            label="End date"
            date={end}
            upDate={(end) => updateQuery({ end })}
          />
        </Stack>
      )}
    </>
  )
}

interface QueryDatePickerProps {
  date?: string
  upDate: (date?: string) => void
  label: string
}
function QueryDatePicker({ date, upDate, label }: QueryDatePickerProps) {
  return (
    <DatePicker
      label={label}
      showDaysOutsideCurrentMonth
      value={dayjs(date)}
      format={DATE_PICKER_FORMAT}
      onChange={(newDay) => {
        // Only update the query when the value is valid.
        // Otherwise it immediately updates the query to undefined which triggers
        // a rerender and resets DatePicker to dayjs(undefined), which returns the current date.
        if (newDay?.isValid()) {
          upDate(newDay.format(DATE_FORMAT))
        }
      }}
      slotProps={{ textField: { fullWidth: true } }}
    />
  )
}
