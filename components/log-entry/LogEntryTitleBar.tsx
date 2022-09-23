import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Props {
    date?: Dayjs | null
}
export default function LogEntryTitleBar(props: Props) {
    const [date, setDate] = useState(props.date)
    const router = useRouter()

    useEffect(() => {
        if (date) {
            router.push(`/log/${date.format('YYYY-MM-DD')}`)
        }
    }, [date])

    return (
        <Box display='flex' justifyContent='space-between'>
            {/* todo: change this to a data type which is user defined per program, or freestyle/unstructured type*/}
            <TextField label='Session Type' />
            {/* todo: customize to show days that have a record; possibly show title; 
            possibly give days a 'type' instead of title, with an associated icon;
            could also highlight different programs / meso cycles */}
            <DatePicker
                label='Date'
                value={date}
                onChange={newDate => setDate(newDate)}
                renderInput={(params) => <TextField {...params} />}
            />
        </Box>
    )
}