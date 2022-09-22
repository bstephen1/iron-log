import { Table, TableBody } from '@mui/material';
import LiftTable from './LiftTable';

interface Props {
    liftRows: { lift: string }[]
}

export default function DayTable(props: Props) {
    return (
        <Table>
            <TableBody>
                {props.liftRows.map((liftRow: { lift: string }) => <LiftTable lift={liftRow.lift} />)}
            </TableBody>
        </Table>
    )
}