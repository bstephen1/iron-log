import DayView from '../../components/day/DayView'
import { dummyExercises } from '../../dummyData'


export default function Today() {
    const today = new Date()
    console.log(today)
    return (
        <>
            <main>
                <DayView date={today} exercises={dummyExercises} />
            </main>
        </>
    )
}