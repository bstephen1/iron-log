import { TextField } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import dayjs, { Dayjs } from 'dayjs'
import BodyweightInput from './BodyweightInput'
import SessionDatePicker from './SessionDatePicker'

interface Props {
  date?: Dayjs | null
}
export default function TitleBar({ date }: Props) {
  return (
    <Grid container spacing={2}>
      {/* todo: change this to a data type which is user defined per program, or freestyle/unstructured type*/}
      <Grid xs={12} sm={4}>
        <SessionDatePicker date={date} />
      </Grid>
      <Grid xs={12} sm={4}>
        <TextField label="Session Type" fullWidth />
      </Grid>
      {/* todo: customize to show days that have a record; possibly show title; 
            possibly give days a 'type' instead of title, with an associated icon;
            could also highlight different programs / meso cycles */}
      <Grid xs={12} sm={4}>
        {' '}
        <BodyweightInput date={date ?? dayjs()} fullWidth />
      </Grid>
    </Grid>
  )
}
