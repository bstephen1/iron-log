import { Paper, Stack, TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
    weight?: number,
    reps?: number,
    rpe?: number,
}
export default function StraightSet(props: Props) {
    const [weight, setWeight] = useState(props.weight || undefined)
    const [reps, setReps] = useState(props.reps || undefined)
    const [rpe, setRpe] = useState(props.rpe || undefined)

    return (
        <Paper sx={{ my: 1 }}>
            <Stack direction='row'>
                {/* use type tel instead of number so there's no increment on scroll */}
                <TextField type='tel' variant='filled' label="weight" value={weight} onChange={e => setWeight(e.target.value as unknown as number)} />
                <TextField type='tel' variant='filled' label="reps" value={reps} onChange={e => setReps(e.target.value as unknown as number)} />
                <TextField type='tel' variant='filled' label="rpe" value={rpe} onChange={e => setRpe(e.target.value as unknown as number)} />
            </Stack>
        </Paper>
    )
}