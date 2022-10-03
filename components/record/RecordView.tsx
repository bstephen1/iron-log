import { Button, Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { DATE_FORMAT } from '../../lib/frontend/constants';
import { createRecord, updateRecord, useRecord } from '../../lib/frontend/restService';
import { ExerciseRecord } from '../../models/record/ExerciseRecord';
import { Record } from '../../models/record/Record';
import ExerciseRecordInput from './ExerciseRecordInput';
import RecordViewClock from './RecordViewClock';
import RecordViewTitleBar from './RecordViewTitleBar';

interface Props {
    date: Dayjs,
}
export default function RecordView(props: Props) {
    const { date } = props
    const { record, isError, mutate } = useRecord(date)
    //when the record is empty it will be null, but if it still hasn't returned yet it will be undefined
    //it looks offputting putting a skeleton in when loading since there can be any number of exerciseRecords,
    //so for now we just hide the add exercise button so the records don't pop in above it
    const isLoading = record === undefined

    const handleAddExercise = async () => {
        let newRecord;
        if (!record) {
            newRecord = new Record(date.format(DATE_FORMAT), [new ExerciseRecord()])
            await createRecord(newRecord)
        } else {
            newRecord = { ...record, exerciseRecords: [...record.exerciseRecords, new ExerciseRecord()] }
            await updateRecord(newRecord)
        }
        //mutate is like useState for the useSWR hook. It changes the local value, then refetches the data to confirm it has updated
        mutate(newRecord)
    }

    const handleUpdateExercise = async (exercise: ExerciseRecord) => {

    }

    //todo: this is a placeholder
    if (isError) {
        return <>Error fetching data!</>
    }

    //todo: compare with last of this day type
    //todo: drag and drop (react-beautiful-dnd?) mongo stores array ordered so dnd can just return a new object with the new order (rather than introducing IDs for subarrays)
    return (
        <Grid container spacing={2} direction='column'>
            <Grid item>
                <RecordViewTitleBar date={date} />
            </Grid>
            <Grid item>
                <RecordViewClock />
            </Grid>
            {record && record.exerciseRecords.map((exerciseRecord, i) => {
                return (
                    <Grid item key={i}>
                        <ExerciseRecordInput
                            exerciseRecord={exerciseRecord}
                            startOpen={i === 0}
                        />
                    </Grid>
                )
            })}

            <Grid item container justifyContent='center'>
                {!isLoading && <Button variant='contained' onClick={handleAddExercise}>Add Exercise</Button>}
            </Grid>
        </Grid>
    )
}