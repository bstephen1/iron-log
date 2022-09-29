import { Button, Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useRecord } from '../../lib/frontend/restService';
import DayRecordClock from './DayRecordClock';
import DayRecordTitleBar from './DayRecordTitleBar';
import ExerciseRecordInput from './ExerciseRecordInput';

interface Props {
    date: Dayjs,
}
export default function DayRecordView(props: Props) {
    const { date } = props
    const { record, isError } = useRecord(date)

    const handleAddExercise = () => {
        // if (!dayRecord) {
        //     setDayRecord(new DayRecord(date.format(DATE_FORMAT)))
        // } else {
        //     setDayRecord({ ...dayRecord, exerciseRecords: [] })
        // }
    }

    if (isError) {
        return <>Error fetching data</>
    }

    if (!record) {
        return <>Loading</>
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
            {record.exerciseRecords.map((exerciseRecord, i) => {
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