import { Button } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { Dayjs } from 'dayjs';
import { DATE_FORMAT } from '../../lib/frontend/constants';
import { createSession, updateSession, useSession } from '../../lib/frontend/restService';
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
    const { session, isError, mutate } = useSession(date)
    //when the record is empty it will be null, but if it still hasn't returned yet it will be undefined
    //it looks offputting putting a skeleton in when loading since there can be any number of exerciseRecords,
    //so for now we just hide the add exercise button so the records don't pop in above it
    const isLoading = session === undefined

    const addRecord = async () => {
        let newSession;
        if (!session) {
            newSession = new Session(date.format(DATE_FORMAT), [new Record()])
            await createSession(newSession)
        } else {
            newSession = { ...session, records: [...session.records, new Record()] }
            await updateSession(newSession)
        }
        //mutate is like useState for the useSWR hook. It changes the local value, then refetches the data to confirm it has updated
        mutate(newSession)
    }

    //todo: use _id? index is fragile if we want to change order  
    const updateRecord = async (record: Record, index: number) => {
        //should definitely not be in a state of updating nonexistant records, so let's just return
        if (!session || !session.records || !session.records[index]) {
            return
        }

        let newSession = { ...session, records: [...session.records] }
        newSession.records[index] = record
        await updateSession(newSession)

        mutate(newSession)
    }

    //todo: this is a placeholder
    if (isError) {
        return <>Error fetching data!</>
    }

    //todo: compare with last of this day type
    //todo: drag and drop (react-beautiful-dnd?) mongo stores array ordered so dnd can just return a new object with the new order (rather than introducing IDs for subarrays)
    return (
        <Grid container spacing={2} direction='column'>
            <Grid>
                <SessionViewTitleBar date={date} />
            </Grid>
            <Grid>
                <SessionViewClock />
            </Grid>
            {session && session.records.map((record, i) => {
                return (
                    <Grid key={i}>
                        <RecordInput
                            record={record}
                            updateRecord={updateRecord}
                            index={i}
                            startOpen={i === 0}
                        />
                    </Grid>
                )
            })}

            <Grid container justifyContent='center'>
                {!isLoading && <Button variant='contained' onClick={addRecord}>Add Exercise</Button>}
            </Grid>
        </Grid>
    )
}