import { Card, CardContent, CardHeader, Checkbox, Stack } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import StyledDivider from 'components/StyledDivider'
import { useRecord } from 'lib/frontend/restService'
import useDisplayFields from 'lib/frontend/useDisplayFields'
import { useEffect, useState } from 'react'
import { useSwiperSlide } from 'swiper/react'
import HistoryCardsSwiper from './HistoryCardsSwiper'

interface Props {
  id: string
}
export default function HistoryFilter({ id }: Props) {
  const { record } = useRecord(id)
  const [modifierFilter, setModifierFilter] = useState<string[]>([])
  const [repFilter, setRepFilter] = useState<number>()
  const [repsChecked, setRepsChecked] = useState(false)
  const [modifiersChecked, setModifiersChecked] = useState(false)
  const displayFields = useDisplayFields({ record })
  const swiperSlide = useSwiperSlide()

  useEffect(() => {
    if (!record) return

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

  if (!record || !displayFields) return <></>

  // todo: may want to merge this into the RecordCard
  return (
    <Stack spacing={2}>
      <Card elevation={3} sx={{ px: 1, m: 0.5 }}>
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
            {/* Only render the swiper if the parent record card is actually visible. 
                This prevents a large initial spike trying to load the history for 
                every record in the session at once. */}
            {swiperSlide.isVisible && (
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
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
