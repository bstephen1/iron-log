import { Button, Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { createRecord, useRecord } from '../../lib/frontend/restService';
import { DATE_FORMAT } from '../../lib/frontend/constants';
import { DayRecord } from '../../models/record/DayRecord';
import { ExerciseRecord } from '../../models/record/ExerciseRecord';
import DayRecordClock from './DayRecordClock';
import DayRecordTitleBar from './DayRecordTitleBar';
import ExerciseRecordInput from './ExerciseRecordInput';

interface Props {
    date: Dayjs,
}
export default function DayRecordView(props: Props) {
    const { date } = props
    const { record, isError, mutate } = useRecord(date)

    const handleAddExercise = async () => {
        let newRecord;
        if (!record) {
            newRecord = new DayRecord(date.format(DATE_FORMAT), [new ExerciseRecord()])
            await createRecord(newRecord)
        } else {
            newRecord = { ...record, exerciseRecords: [...record.exerciseRecords, new ExerciseRecord()] }
        }
        mutate(newRecord)
    }

    useEffect(() => {
        console.log(record)
    }, [record])

    if (isError) {
        return <>Error fetching data</>
    }

    //when the record is empty it will be null, but if it still hasn't returned yet it will be undefined
    if (record === undefined) {
        return <>Loading...</>
    }

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
            {record && record.exerciseRecords.map((exerciseRecord, i) => {
                return (
                    <Grid item>
                        <ExerciseRecordInput
                            exerciseRecord={exerciseRecord}
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