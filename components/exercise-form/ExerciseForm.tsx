import { Button, Divider, Stack, TextField } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useContext } from 'react';
import Exercise from '../../models/Exercise';
import CueInput from './CueInput';
import ModifiersInput from './ModifiersInput';
import NameInput from './NameInput';
import StatusInput from './StatusInput';
import { ExerciseFormContext } from './useExerciseForm';

interface Props {
    exercise: Exercise | null,
}
export default function ExerciseForm({ exercise }: Props) {
    const { dirtyExercise, formValidity, resetExercise } = useContext(ExerciseFormContext)


    return (
        <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
                <Stack>
                    <NameInput />
                    <StatusInput />
                    <ModifiersInput />
                </Stack>
            </Grid>
            <Grid xs={12} sm={6}>
                {/* todo: center text? outline? divider style in the middle? */}
                <Divider textAlign='center'>
                    Cues
                </Divider>
                {/* todo: Component for each ListItem. drag n drop? */}
                <Button
                    disabled={!exercise}
                // onClick={() => setDirtyExercise({ ...dirtyExercise, cues: ['', ...dirtyExercise.cues] })}
                >
                    Add
                </Button>
                <Stack spacing={2}>
                    {dirtyExercise?.cues.map((cue, i) => (
                        <CueInput
                            key={i}
                            index={i}
                            value={cue}
                            handleDelete={() => { }}
                            handleUpdate={() => { }}
                        />))}
                </Stack>
            </Grid>
            <Grid xs={12}>
                <TextField
                    multiline
                    fullWidth
                    disabled={!exercise}
                    value={dirtyExercise?.notes || ''}
                    // onChange={(e) => setDirtyExercise({ ...dirtyExercise, notes: e.target.value })}
                    label='Notes'
                />
            </Grid>
            <Grid xs={12}>
                <Button onClick={resetExercise} disabled={!exercise}>Reset</Button>
                {/* todo: disable when no changes */}
                <Button variant='contained' disabled={!exercise} onClick={undefined}>Save Changes</Button>
            </Grid>
        </Grid>
    )
}