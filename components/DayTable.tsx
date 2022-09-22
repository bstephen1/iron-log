import { Paper, Table, TableBody } from '@mui/material';
import LiftTable from './LiftTable';

interface Props {
    liftRows: { lift: string }[]
}

export default function DayTable(props: Props) {
    return (
        <>
            {props.liftRows.map((liftRow: { lift: string }) => <LiftTable lift={liftRow.lift} />)}
        </>
    )
}