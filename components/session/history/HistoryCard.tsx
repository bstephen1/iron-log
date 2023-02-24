import { Notes } from '@mui/icons-material'
import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import useDisplayFields from '../../../lib/frontend/useDisplayFields'
import useExtraWeight from '../../../lib/frontend/useExtraWeight'
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
  const router = useRouter()
  const displayFields = useDisplayFields({ record })
  const extraWeight = useExtraWeight({ record })
  // use splitWeight if parent record is using it, even if this history record doesn't have the
  // right modifiers for it to be active
  const showSplitWeight = displayFields.visibleFields.some((field) =>
    ['plateWeight', 'totalWeight'].includes(field.name)
  )

  return (
    <Card elevation={0}>
      <CardHeader
        title={
          <Box
            // todo: Could add the record number so swiper can directly link to the record.
            // May not be worth the effort tho.
            onClick={() => router.push(record.date)}
            sx={{ cursor: 'pointer' }}
            width="fit-content"
          >
            {record.date}
          </Box>
        }
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <RecordNotesDialogButton
            notes={record.notes}
            Icon={<Notes />}
            tooltipTitle="Record Notes"
            setsAmount={record.sets.length}
            readOnly
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
            readOnly
          />
          <SetHeader readOnly {...{ displayFields, showSplitWeight }} />
        </Stack>
        <Box sx={{ pb: 0 }}>
          {record.sets.map((set, i) => (
            <SetInput
              key={i}
              readOnly
              {...{ set, displayFields, extraWeight }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
