import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material'
import Record from '../../../models/Record'
import { Set } from '../../../models/Set'
import { ComboBoxField } from '../../form-fields/ComboBoxField'
import StyledDivider from '../../StyledDivider'
import RecordNotesDialogButton from '../records/RecordNotesDialogButton'
import SetHeader from '../records/SetHeader'
import SetInput from '../records/SetInput'

interface Props {
  record: Record
  fields?: (keyof Set)[]
}
export default function HistoryCard({ record }: Props) {
  // todo: same fields as parent, readonly
  const fields: (keyof Set)[] = ['weight', 'reps', 'effort']

  // todo: readonly
  return (
    <Card elevation={0}>
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
        <Stack spacing={2}>
          <ComboBoxField
            label="Modifiers"
            options={record.activeModifiers}
            initialValue={record.activeModifiers}
            variant="standard"
            handleSubmit={() => {}}
          />
          <SetHeader initialSelected={fields} handleSubmit={() => {}} />
        </Stack>
        <Box sx={{ pb: 0 }}>
          {record.sets.map((set, i) => (
            <SetInput
              set={set}
              fields={fields}
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
