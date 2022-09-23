import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import Exercise from '../../models/Exercise';
import LogEntryTitleBar from './LogEntryTitleBar';
import ExerciseInput from './ExerciseInput';
import { Dayjs } from 'dayjs';

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
        <Stack spacing={2}>
            <LogEntryTitleBar date={date} />
            {exercises.map((exercise, i) => <ExerciseInput exercise={exercise} startOpen={i === 0} />)}
            <Button variant='contained' onClick={handleAddExercise}>Add Exercise</Button>
        </Stack>
    )
}