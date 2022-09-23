import { Box, Button } from '@mui/material';
import { useState } from 'react';
import ExerciseRecord from './ExerciseRecord';

interface Props {
    date: Date,
    exerciseRows: { exercise: string }[]
}
export default function DayRecord(props: Props) {
    const { date, exerciseRows } = props
    const [exercises, setExercises] = useState(exerciseRows)

    const handleAddExercise = () => {
        //@ts-ignore
        setExercises(exercises.concat({}))
    }

    //only show year if not current year
    //Day name top left; date top right; timer underneath
    return (
        <>
            <Box>{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</Box>
            {exercises.map((exerciseRow: { exercise: string }, i) => <ExerciseRecord exercise={exerciseRow.exercise} startOpen={i === 0} />)}
            <Button variant='contained' onClick={handleAddExercise}>Add Exercise</Button>
        </>
    )
}