import { Input, TableCell, TableRow, TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
    weight?: number,
    reps?: number,
}
export default function StraightSet(props: Props) {
    const [weight, setWeight] = useState(props.weight || 0)
    const [reps, setReps] = useState(props.reps || 0)
    const [rpe, setRpe] = useState(0)

    return (
        <TableRow>
            <TableCell>
                {/* use type tel instead of number so there's no increment on scroll */}
                <Input value={weight} type='tel' onChange={e => setWeight(e.target.value as unknown as number)} />
            </TableCell>
            <TableCell>
                <TextField type='tel' label="reps" value={reps} onChange={e => setReps(e.target.value as unknown as number)} />
            </TableCell>
            <TableCell>8</TableCell>
        </TableRow>
    )
}