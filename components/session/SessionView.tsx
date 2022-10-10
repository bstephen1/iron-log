import { Button, Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { DATE_FORMAT } from '../../lib/frontend/constants';
import { createRecord, updateRecord, useRecord } from '../../lib/frontend/restService';
import { Record } from '../../models/Record';
import { Session } from '../../models/Session';
import RecordInput from './RecordInput';
import SessionViewClock from './SessionViewClock';
import SessionViewTitleBar from './SessionViewTitleBar';

interface Props {
    date: Dayjs,
}
export default function SessionView(props: Props) {
    const { date } = props
    const { record, isError, mutate } = useRecord(date)
    //when the record is empty it will be null, but if it still hasn't returned yet it will be undefined
    //it looks offputting putting a skeleton in when loading since there can be any number of exerciseRecords,
    //so for now we just hide the add exercise button so the records don't pop in above it
    const isLoading = record === undefined

    const addExercise = async () => {
        let newRecord;
        if (!record) {
            newRecord = new Session(date.format(DATE_FORMAT), [new Record()])
            await createRecord(newRecord)
        } else {
            newRecord = { ...record, records: [...record.records, new Record()] }
            await updateRecord(newRecord)
        }
        //mutate is like useState for the useSWR hook. It changes the local value, then refetches the data to confirm it has updated
        mutate(newRecord)
    }

    //todo: use _id? index is fragile if we want to change order  
    const updateExerciseRecord = async (exerciseRecord: Record, index: number) => {
        //should definitely not be in a state of updating nonexistant records, so let's just return
        if (!record || !record.records || !record.records[index]) {
            return
        }

        let newRecord = { ...record }
        newRecord.records[index] = exerciseRecord
        await updateRecord(newRecord)

        mutate(newRecord)

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
                <SessionViewTitleBar date={date} />
            </Grid>
            <Grid item>
                <SessionViewClock />
            </Grid>
            {record && record.records.map((exerciseRecord, i) => {
                return (
                    <Grid item key={i}>
                        <RecordInput
                            exerciseRecord={exerciseRecord}
                            updateExerciseRecord={updateExerciseRecord}
                            index={i}
                            startOpen={i === 0}
                        />
                    </Grid>
                )
            })}

            <Grid item container justifyContent='center'>
                {!isLoading && <Button variant='contained' onClick={addExercise}>Add Exercise</Button>}
            </Grid>
        </Grid>
    )
}