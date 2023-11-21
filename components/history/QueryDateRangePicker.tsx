import { MenuItem, Stack, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'lib/frontend/constants'
import { UpdateState } from 'lib/util'
import { RecordHistoryQuery } from 'models/query-filters/RecordQuery'
import { useState } from 'react'

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
          <DatePicker
            label="Start date"
            // this works as just "start", but onChange still gives a dayjs anyway
            value={dayjs(start)}
            onChange={(newDay) =>
              updateQuery({ start: newDay?.format(DATE_FORMAT) ?? undefined })
            }
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="End date"
            value={dayjs(end)}
            onChange={(newDay) =>
              updateQuery({ start: newDay?.format(DATE_FORMAT) ?? undefined })
            }
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Stack>
      )}
    </>
  )
}
