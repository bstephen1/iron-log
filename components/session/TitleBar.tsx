import { Box, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { DATE_FORMAT } from '../../lib/frontend/constants'

interface Props {
  date?: Dayjs | null
}
export default function TitleBar(props: Props) {
  const [date, setDate] = useState(props.date)
  const router = useRef(useRouter())

  useEffect(() => {
    if (date?.isValid()) {
      // can either useRef here or add router to dep array
      // not sure which is better. I don't know why router would ever change value
      router.current.push(`/sessions/${date.format(DATE_FORMAT)}`)
    }
  }, [date])

  return (
    <Box display="flex" justifyContent="space-between">
      {/* todo: change this to a data type which is user defined per program, or freestyle/unstructured type*/}
      <TextField label="Session Type" />
      {/* todo: customize to show days that have a record; possibly show title; 
            possibly give days a 'type' instead of title, with an associated icon;
            could also highlight different programs / meso cycles */}
      <DatePicker
        label="Date"
        value={date}
        onChange={(newDate) => setDate(newDate)}
        renderInput={(params) => <TextField {...params} />}
      />
    </Box>
  )
}
