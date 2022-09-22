import { Box, Collapse, Paper, Table, TableBody } from '@mui/material';
import { useState } from 'react';
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


    return (
        <Paper elevation={5} sx={{ my: 1, px: 1 }}>
            <Box onClick={() => setOpen(!open)} p={2} display='flex' justifyContent='space-between'>
                {props.lift}
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Box>
            <Collapse in={open}>
                <Box>
                    <Table>
                        <TableBody>
                            <StraightSet />
                            <StraightSet />
                        </TableBody>
                    </Table>
                </Box>
            </Collapse>
        </Paper>
    )
}