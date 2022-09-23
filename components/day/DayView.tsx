import { Box, Button } from '@mui/material';
import { useState } from 'react';
import Exercise from '../../models/Exercise';
import ExerciseInput from './ExerciseInput';

interface Props {
    date: Date,
    exercises: Exercise[],
}
export default function DayView(props: Props) {
    const { date } = props
    const [exercises, setExercises] = useState<(Exercise | undefined)[]>(props.exercises)

    const handleAddExercise = () => {
        setExercises(exercises.concat(undefined))
    }

    //only show year if not current year
    //Day name top left; date top right; timer underneath
    return (
        <>
            <Box>{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</Box>
            {exercises.map((exercise, i) => <ExerciseInput exercise={exercise} startOpen={i === 0} />)}
            <Button variant='contained' onClick={handleAddExercise}>Add Exercise</Button>
        </>
    )
}