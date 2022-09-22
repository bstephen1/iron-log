import { Box } from '@mui/material'
import DayRecord from '../../components/DayRecord'


export default function Today() {
    const today = new Date()
    console.log(today)
    return (
        <>
            <main>
                <DayRecord date={today} liftRows={[{ lift: 'pull' }, { lift: 'push' }]} />
            </main>
        </>
    )
}