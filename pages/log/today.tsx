import dayjs from 'dayjs'
import Head from 'next/head'
import LogEntry from '../../components/log-entry/LogEntry'
import { dummyExercises } from '../../dummyData'


export default function Today() {
    const today = dayjs()
    return (
        <>
            <Head>
                <title>Today's log</title>
            </Head>
            <main>
                <LogEntry date={today} exercises={dummyExercises} />
            </main>
        </>
    )
}