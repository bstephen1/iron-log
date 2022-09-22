import { Box } from '@mui/material';
import LiftRecord from './LiftRecord';

interface Props {
    date: Date,
    liftRows: { lift: string }[]
}

export default function DayRecord(props: Props) {
    const { date, liftRows } = props
    //only show year if not current year
    //Day name top left; date top right; timer underneath
    return (
        <>
            <Box>{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</Box>
            {liftRows.map((liftRow: { lift: string }) => <LiftRecord lift={liftRow.lift} />)}
        </>
    )
}