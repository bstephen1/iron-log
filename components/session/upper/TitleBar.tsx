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
export default function TitleBar(props: Props) {
  const day = dayjs(props.date)
  const router = useRouter()

  const handleDateChange = (newDay: Dayjs) => {
    const date = newDay.format(DATE_FORMAT)
    router.push(date)
  }

  return (
    <Grid container spacing={2} justifyContent="space-between">
      {/* todo: change this to a data type which is user defined per program, or freestyle/unstructured type*/}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
      >
        <SessionDatePicker
          day={day}
          handleDayChange={handleDateChange}
          textFieldProps={{ fullWidth: true }}
        />
      </Grid>
      {/* todo: session type */}
      {/* todo: customize to show days that have a record; possibly show title; 
            possibly give days a 'type' instead of title, with an associated icon;
            could also highlight different programs / meso cycles */}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
      >
        <BodyweightInput day={day} fullWidth />
      </Grid>
    </Grid>
  )
}
