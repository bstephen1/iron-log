import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Autocomplete, Box, Collapse, ListItemButton, Paper, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { useRef, useState } from 'react';
import StraightSet from './set-types/StraightSet';

interface Props {
    lift?: string,
    modifiers?: string[], //band, pause
    type?: string, //straight sets, myo 
}
export default function LiftRecord(props: Props) {
    const [open, setOpen] = useState(true)
    const [lift, setLift] = useState(props.lift || '')
    const listItemButton = useRef(null)

    const disableButtonEffects = (e: React.MouseEvent<HTMLElement, MouseEvent>) => e.stopPropagation()


    return (
        <ListItemButton ref={listItemButton} onClick={() => setOpen(!open)} sx={{ my: 1, p: 0, borderRadius: 1 }} id='clickableArea'>
            <Paper elevation={3} sx={{ px: 1, width: 1 }}>
                <Box p={2} display='flex' justifyContent='space-between'>
                    <Stack direction='row' onMouseDown={disableButtonEffects} onClick={disableButtonEffects}>
                        <TextField value={lift} onChange={(e) => setLift(e.target.value)} label='Movement' variant='standard' onMouseDown={disableButtonEffects} onClick={disableButtonEffects} />
                        <Autocomplete options={['band', 'pause', 'belt']} multiple renderInput={(params) => <TextField {...params} variant='standard' label='Modifiers' />} />
                        <Autocomplete options={['straight']} renderInput={(params) => <TextField {...params} variant='standard' label='Set Type' />} />
                    </Stack>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </Box>
                {/* onMouseDown disables mui Button ripple; onClick disables activating the button */}
                <Collapse in={open} onMouseDown={disableButtonEffects} onClick={disableButtonEffects} sx={{ ml: 5, cursor: 'default' }}>
                    <Box>
                        <StraightSet />
                        <StraightSet />
                    </Box>
                </Collapse>
            </Paper>
        </ListItemButton>
    )
}