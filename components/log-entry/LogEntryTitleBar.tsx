import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

export default function LogEntryTitleBar() {
    const [date, setDate] = useState<Dayjs | null>(null)

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