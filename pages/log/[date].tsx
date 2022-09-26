import dayjs from 'dayjs';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LogEntry from '../../components/log-entry/LogEntry';
import { dummyExercises } from '../../dummyData';


//I guess a separate session number in case you want to do multiple sessions in one day
//or, add separate sessions to the same day?
export default function Log() {
    const router = useRouter()
    //todo: can route by directly entering a url
    //todo: there's a split second when linking from homepage that has an expanded dayjs object as the url
    //@ts-ignore
    const date = dayjs(router.query.date)
    return (
        <>
            <Head>
                <title>Log</title>
            </Head>
            <main>
                <LogEntry date={date} exercises={dummyExercises} />
            </main>
        </>
    )
}