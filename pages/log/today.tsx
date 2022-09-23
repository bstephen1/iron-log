import LogEntry from '../../components/log-entry/LogEntry'
import Navbar from '../../components/Navbar'
import { dummyExercises } from '../../dummyData'


export default function Today() {
    const today = new Date()
    console.log(today)
    return (
        <>
            <main>
                <LogEntry date={today} exercises={dummyExercises} />
            </main>
        </>
    )
}