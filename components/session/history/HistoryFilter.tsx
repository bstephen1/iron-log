import { Card, CardContent, CardHeader, Checkbox, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRecord } from '../../../lib/frontend/restService'
import { dayjsStringAdd } from '../../../lib/util'
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
  const [repsChecked, setRepsChecked] = useState(true)
  const [modifiersChecked, setModifiersChecked] = useState(true)

  useEffect(() => {
    if (record) {
      setModifierFilter(record.activeModifiers)
      setRepFilter(record.sets[0].reps)
    }
  }, [record])

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

        <CardContent sx={{ px: 1 }}>
          <Stack spacing={2}>
            <Stack direction="row">
              <Checkbox
                checked={modifiersChecked}
                onChange={(e) => setModifiersChecked(e.target.checked)}
                sx={{ width: '55px', height: '55px' }}
              />
              <ComboBoxField
                label="Filter Modifiers"
                options={record.exercise?.modifiers}
                initialValue={record.activeModifiers}
                variant="standard"
                handleSubmit={setModifierFilter}
              />
            </Stack>
            <Stack direction="row">
              <Checkbox
                checked={repsChecked}
                onChange={(e) => setRepsChecked(e.target.checked)}
                sx={{ width: '55px', height: '55px' }}
              />
              <NumericFieldAutosave
                label="Filter reps"
                initialValue={record.sets[0].reps}
                handleSubmit={setRepFilter}
                variant="standard"
              />
            </Stack>
            <HistoryCardsSwiper
              recordId={recordId}
              filter={{
                exercise: record.exercise?.name,
                reps: repsChecked ? repFilter : undefined,
                modifier: modifiersChecked ? modifierFilter : undefined,
                end: dayjsStringAdd(record.date, -1, 'day'),
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
