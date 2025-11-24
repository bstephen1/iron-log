'use client'
import Grid from '@mui/material/Grid'
import dayjs, { type Dayjs } from 'dayjs'
import { useRouter } from 'next/navigation'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import BodyweightInput from './BodyweightInput'
import SessionDatePicker from './SessionDatePicker'

interface Props {
  date: string
}
export default function TitleBar({ date }: Props) {
  const router = useRouter()

  const handleDateChange = (newDay: Dayjs) => {
    const date = newDay.format(DATE_FORMAT)
    router.push(date)
  }

  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
      >
        <SessionDatePicker
          day={dayjs(date)}
          handleDayChange={handleDateChange}
          textFieldProps={{ fullWidth: true }}
        />
      </Grid>
      {/* todo: session type: user defined per program, or freestyle/unstructured type */}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
      >
        <BodyweightInput date={date} fullWidth />
      </Grid>
    </Grid>
  )
}
