import { Card, CardContent, CardHeader, Stack } from '@mui/material'
import { useState } from 'react'
import { useRecord } from '../../../lib/frontend/restService'
import { ComboBoxField } from '../../form-fields/ComboBoxField'
import NumericFieldAutosave from '../../form-fields/NumericFieldAutosave'
import StyledDivider from '../../StyledDivider'
import HistoryCardsSwiper from './HistoryCardsSwiper'

interface Props {
  recordId: string
}
export default function HistoryFilter({ recordId }: Props) {
  const { record } = useRecord(recordId)
  const [modifierFilter, setModifierFilter] = useState<string[]>([])
  const [repFilter, setRepFilter] = useState<number>()

  if (!record) return <></>

  // todo: may want to merge this into the RecordCard

  return (
    <Stack spacing={2}>
      <Card elevation={3} sx={{ px: 1 }}>
        <CardHeader
          title={`History`}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

        <CardContent>
          <Stack spacing={2}>
            <ComboBoxField
              label="Filter Modifiers"
              options={record.exercise?.modifiers}
              initialValue={record.activeModifiers}
              variant="standard"
              handleSubmit={setModifierFilter}
            />
            <NumericFieldAutosave
              label="Filter reps"
              initialValue={record.sets[0].reps}
              handleSubmit={setRepFilter}
              variant="standard"
            />
            <HistoryCardsSwiper
              recordId={recordId}
              filter={{ exercise: record.exercise?.name }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
