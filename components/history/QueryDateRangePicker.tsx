import { DatePickerProps } from '@mui/lab'
import { MenuItem, Stack, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useState } from 'react'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import { UpdateState } from '../../lib/util'
import { RecordHistoryQuery } from '../../models/query-filters/RecordQuery'

const today = dayjs()
const todayFormatted = dayjs().format(DATE_FORMAT)

interface Props {
  query: RecordHistoryQuery
  updateQuery: UpdateState<RecordHistoryQuery>
}
export default function QueryDateRangePicker({ query, updateQuery }: Props) {
  const { start, end } = query
  const [quickMonthRange, setQuickMonthRange] = useState('3')
  const isCustom = !quickMonthRange

  const handleQuickMonthChange = (monthsString: string) => {
    const monthsNum = +monthsString

    setQuickMonthRange(monthsString)
    if (monthsNum > 0) {
      updateQuery({
        start: today.add(-monthsNum, 'months').format(DATE_FORMAT),
        end: todayFormatted,
      })
    } else if (monthsNum < 0) {
      // a negative month amount is considered "no filter"
      updateQuery({
        start: undefined,
        end: undefined,
      })
    }
  }
  return (
    <>
      <TextField
        label="Date range"
        select
        value={quickMonthRange}
        onChange={(e) => handleQuickMonthChange(e.target.value)}
        // should also shrink input
        SelectProps={{
          displayEmpty: true,
        }}
        InputLabelProps={{ shrink: true }}
      >
        <MenuItem value="3">Last 3 months</MenuItem>
        <MenuItem value="6">Last 6 months</MenuItem>
        <MenuItem value="12">Last year</MenuItem>
        <MenuItem value="-1">No filter</MenuItem>
        <MenuItem value="">Custom</MenuItem>
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

interface QueryDatePickerProps extends DatePickerProps<string> {
  date?: string
  upDate: (date?: string) => void
}
function QueryDatePicker({
  date,
  upDate,
  ...datePickerProps
}: QueryDatePickerProps) {
  return (
    <DatePicker
      {...datePickerProps}
      showDaysOutsideCurrentMonth
      value={dayjs(date)}
      onChange={(newDay) => {
        // Only update the query when the value is valid, or null.
        // Otherwise it immediately updates the query to undefined which triggers
        // a rerender and resets DatePicker to dayjs(undefined), which returns the current date.
        if (!newDay || newDay.isValid()) {
          upDate(newDay ? newDay.format(DATE_FORMAT) : undefined)
        }
      }}
      slotProps={{ textField: { fullWidth: true } }}
    />
  )
}
