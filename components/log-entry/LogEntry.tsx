import { Button, Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import Exercise from '../../models/Exercise';
import ExerciseInput from './ExerciseInput';
import LogEntryTitleBar from './LogEntryTitleBar';

interface Props {
    date: Dayjs,
    exercises: Exercise[],
}
export default function LogEntry(props: Props) {
    const { date } = props
    const [exercises, setExercises] = useState<(Exercise | undefined)[]>(props.exercises)

    const handleAddExercise = () => {
        setExercises(exercises.concat(undefined))
    }

    //todo: timer underneath title
    //todo: compare with last of this day type
    return (
        // todo: change to grid so exercise button can be smaller
        <Grid container spacing={2} direction='column'>
            <Grid item>
                <LogEntryTitleBar date={date} />
            </Grid>
            {/* todo: use a unique key so they can be rearranged */}
            {exercises.map((exercise, i) => {
                return (
                    <Grid item>
                        <ExerciseInput exercise={exercise} startOpen={i === 0} key={i} />
                    </Grid>
                )
            })}

            <Grid item container justifyContent='center'>
                <Button variant='contained' onClick={handleAddExercise}>Add Exercise</Button>
            </Grid>
        </Grid>
    )
}