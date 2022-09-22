import { Box } from '@mui/material'
import DayTable from '../../components/DayTable'


export default function Today() {
    const today = new Date()
    console.log(today)
    return (
        <>
            <main>
                <Box>today is {today.getMonth() + 1}/{today.getDate()}</Box>
                <DayTable liftRows={[{ lift: 'pull' }, { lift: 'push' }]} />
            </main>
        </>
    )
}