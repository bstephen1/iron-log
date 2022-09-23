import { Box } from '@mui/material'
import DayView from '../../components/day/DayView'


export default function Today() {
    const today = new Date()
    console.log(today)
    return (
        <>
            <main>
                <DayView date={today} exerciseRows={[{ exercise: 'pull' }, { exercise: 'push' }]} />
            </main>
        </>
    )
}