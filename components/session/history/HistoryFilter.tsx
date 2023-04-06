import { Card, CardContent, CardHeader, Checkbox, Stack } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import StyledDivider from 'components/StyledDivider'
import { useRecordWithInit } from 'lib/frontend/restService'
import useDisplayFields from 'lib/frontend/useDisplayFields'
import Record from 'models/Record'
import { useEffect, useState } from 'react'
import HistoryCardsSwiper from './HistoryCardsSwiper'

interface Props {
  initialRecord: Record
}
export default function HistoryFilter({ initialRecord }: Props) {
  const { record } = useRecordWithInit(initialRecord)
  const [modifierFilter, setModifierFilter] = useState<string[]>([])
  const [repFilter, setRepFilter] = useState<number>()
  const [repsChecked, setRepsChecked] = useState(false)
  const [modifiersChecked, setModifiersChecked] = useState(false)
  const displayFields = useDisplayFields({ record })

  useEffect(() => {
    // only filter if there is a value.
    // todo: can't filter on no modifiers. Api gets "modifier=&" which is just dropped.
    setModifiersChecked(!!record.activeModifiers.length)
    setModifierFilter(record.activeModifiers)

    // todo: amrap/myo need to be special default modifiers rather than hardcoding here
    if (
      record.sets[0]?.reps &&
      !record.activeModifiers.includes('amrap') &&
      !record.activeModifiers.includes('myo')
    ) {
      setRepsChecked(true)
      setRepFilter(record.sets[0].reps)
    } else {
      setRepsChecked(false)
      setRepFilter(undefined)
    }
  }, [record])

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
                initialValue={record.sets[0]?.reps}
                handleSubmit={setRepFilter}
                variant="standard"
              />
            </Stack>
            <HistoryCardsSwiper
              recordId={record._id}
              currentDate={record.date}
              displayFields={displayFields}
              filter={{
                exercise: record.exercise?.name,
                reps: repsChecked ? repFilter : undefined,
                modifier: modifiersChecked ? modifierFilter : undefined,
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
