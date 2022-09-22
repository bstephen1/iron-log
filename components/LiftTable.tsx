import { Box, Collapse, ListItemButton, Paper, Table, TableBody } from '@mui/material';
import { useState, useRef } from 'react';
import StraightSet from './set-types/StraightSet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface Props {
    lift: string,
    modifiers?: string[], //band, pause
    type?: string, //straight sets, myo 
}
export default function LiftTable(props: Props) {
    const [open, setOpen] = useState(true)
    const listItemButton = useRef(null)

    const disableButtonEffects = (e: React.MouseEvent<HTMLElement, MouseEvent>) => e.stopPropagation()


    return (
        <ListItemButton ref={listItemButton} onClick={() => setOpen(!open)} sx={{ my: 1, p: 0, borderRadius: 1 }} id='clickableArea'>
            <Paper elevation={3} sx={{ px: 1, width: 1 }}>
                <Box p={2} display='flex' justifyContent='space-between'>
                    {props.lift}
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </Box>
                {/* onMouseDown disables mui Button ripple; onClick disables activating the button */}
                <Collapse in={open} onMouseDown={disableButtonEffects} onClick={disableButtonEffects} style={{ cursor: 'default' }}>
                    <Box>
                        <StraightSet />
                        <StraightSet />
                    </Box>
                </Collapse>
            </Paper>
        </ListItemButton>
    )
}