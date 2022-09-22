import { Box, Collapse, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import StraightSet from './set-types/StraightSet';

interface Props {
    lift: string,
    modifiers?: string[], //band, pause
    type?: string, //straight sets, myo 
}
export default function LiftTable(props: Props) {
    const [open, setOpen] = useState(true)


    return (
        <>
            <TableRow key={0} onClick={() => setOpen(!open)}>
                <TableCell>
                    {props.lift}
                </TableCell>
            </TableRow>
            <TableRow key={1}>
                <TableCell>
                    <Collapse in={open}>
                        <Box sx={{ margin: 1 }}>
                            <Table>
                                <TableBody>
                                    <StraightSet />
                                    <StraightSet />
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}