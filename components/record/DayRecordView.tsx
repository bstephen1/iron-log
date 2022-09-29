import { Button, Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { DATE_FORMAT } from '../../lib/utils';
import Exercise from '../../models/Exercise';
import { DayRecord } from '../../models/record/DayRecord';
import DayRecordClock from './DayRecordClock';
import DayRecordTitleBar from './DayRecordTitleBar';
import ExerciseRecordInput from './ExerciseRecordInput';

interface Props {
    date: Dayjs,
}
export default function DayRecordView(props: Props) {
    const { date } = props
    const [loading, setLoading] = useState(true)
    const [dayRecord, setDayRecord] = useState<DayRecord | undefined>()
    const [exercises, setExercises] = useState<Exercise[]>([])

    const handleAddExercise = () => {
        if (!dayRecord) {
            setDayRecord(new DayRecord(date.format(DATE_FORMAT)))
        } else {
            setDayRecord({ ...dayRecord, exerciseRecords: [] })
        }
    }

    useEffect(() => {
        const dateFormatted = date.format(DATE_FORMAT)
        fetch('/api/records/' + dateFormatted)
            .then(res => res.json())
            .then(data => {
                setDayRecord(data)
            })
        fetch('api/exercises')
            .then(res => res.json())
            .then(exercises => {
                setExercises(exercises)
            })
    }, [])

    //todo: compare with last of this day type
    return (
        <Grid container spacing={2} direction='column'>
            <Grid item>
                <DayRecordTitleBar date={date} />
            </Grid>
            <Grid item>
                <DayRecordClock />
            </Grid>
            {/* todo: use a unique key so they can be rearranged */}
            {dayRecord && dayRecord.exerciseRecords.map((exerciseRecord, i) => {
                return (
                    <Grid item>
                        <ExerciseRecordInput
                            exerciseRecord={exerciseRecord}
                            exercisesAvailable={exercises}
                            startOpen={i === 0}
                            key={i}
                        />
                    </Grid>
                )
            })}

            <Grid item container justifyContent='center'>
                <Button variant='contained' onClick={handleAddExercise}>Add Exercise</Button>
            </Grid>
        </Grid>
    )
}