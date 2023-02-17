import { Notes } from '@mui/icons-material'
import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material'
import { DEFAULT_DISPLAY_FIELDS } from '../../../models/DisplayFields'
import Record from '../../../models/Record'
import { ComboBoxField } from '../../form-fields/ComboBoxField'
import StyledDivider from '../../StyledDivider'
import RecordNotesDialogButton from '../records/RecordNotesDialogButton'
import SetHeader from '../records/SetHeader'
import SetInput from '../records/SetInput'

interface Props {
  record: Record
}
export default function HistoryCard({ record }: Props) {
  const displayFields = record.exercise?.displayFields ?? DEFAULT_DISPLAY_FIELDS

  // todo: readonly?
  return (
    <Card elevation={0}>
      <CardHeader
        // todo: onclick route to that day
        title={`${record.date}`}
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <RecordNotesDialogButton
            notes={record.notes}
            Icon={<Notes />}
            tooltipTitle="Record Notes"
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
          <SetHeader displayFields={displayFields} handleSubmit={() => {}} />
        </Stack>
        <Box sx={{ pb: 0 }}>
          {record.sets.map((set, i) => (
            <SetInput
              set={set}
              displayFields={displayFields}
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
