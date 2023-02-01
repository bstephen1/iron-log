import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { useSwiper } from 'swiper/react'
import Record from '../../models/Record'
import Set from '../../models/Set'
import StyledDivider from '../StyledDivider'
import RecordNotesDialogButton from './RecordNotesDialogButton'
import SetInput from './SetInput'

interface Props {
  record: Record
  fields?: (keyof Set)[]
}
export default function HistoryCard({ record, fields }: Props) {
  const swiper = useSwiper()

  return (
    <Card elevation={0} sx={{ mr: 3 }}>
      <CardHeader
        // todo: onclick route to that day
        title={`${record.date}`}
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <RecordNotesDialogButton
            // className={noSwipingAboveSm}
            notes={record.notes}
            setsAmount={record.sets.length}
            handleSubmit={() => {}}
          />
        }
      />
      <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

      <CardContent>
        <Box sx={{ pb: 0 }}>
          {record.sets.map((set, i) => (
            <SetInput
              set={set}
              fields={['weight', 'reps', 'effort']}
              key={i}
              handleSubmit={() => {}}
              handleDelete={() => {}}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
