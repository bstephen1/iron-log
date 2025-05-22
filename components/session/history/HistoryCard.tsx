import Link from 'next/link'
import { type JSX, memo } from 'react'
import ComboBoxField from '../../../components/form-fields/ComboBoxField'
import StyledDivider from '../../../components/StyledDivider'
import useDisplayFields from '../../../lib/frontend/useDisplayFields'
import useExtraWeight from '../../../lib/frontend/useExtraWeight'
import { type DisplayFields } from '../../../models/DisplayFields'
import { type Record } from '../../../models/Record'
import { calculateTotalValue } from '../../../models/Set'
import ExerciseNotesButton from '../records/header/ExerciseNotesButton'
import ManageExerciseButton from '../records/header/ManageExerciseButton'
import RecordNotesButton from '../records/header/ReccordNotesButton'
import RenderSets from '../records/sets/RenderSets'
import SetTypeSelect from '../records/SetTypeSelect'
import Card, { type CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

export type HistoryAction = 'recordNotes' | 'exerciseNotes' | 'manage'
export type HistoryContent = 'sets' | 'exercise' | 'modifiers' | 'setType'

interface Props {
  /** Must use the displayFields of the parent record when used within a RecordCard.
   * The history record's displayFields will be stale if the parent's fields change.
   */
  displayFields?: DisplayFields
  record: Record
  isQuickRender?: boolean
  actions?: HistoryAction[]
  content?: HistoryContent[]
  cardProps?: CardProps
}
export default memo(function HistoryCard({
  record,
  isQuickRender,
  actions,
  content,
  cardProps,
  ...props
}: Props) {
  const { sets, _id, notes, date, exercise, activeModifiers, setType } = record
  const recordDisplayFields = useDisplayFields(exercise)
  const { extraWeight, exerciseWeight } = useExtraWeight(record)

  const displayFields = props.displayFields ?? recordDisplayFields

  // use splitWeight if parent record is using it
  const showSplitWeight = displayFields.visibleFields.some((field) =>
    ['plateWeight', 'totalWeight'].includes(field.name)
  )

  const actionComponents: { [key in HistoryAction]: JSX.Element } = {
    recordNotes: <RecordNotesButton key="record notes" {...{ notes, date }} />,
    exerciseNotes: (
      <ExerciseNotesButton key="exercise notes" notes={exercise?.notes} />
    ),
    manage: <ManageExerciseButton key="manage" name={exercise?.name} />,
  }

  const contentComponents: { [key in HistoryContent]: JSX.Element } = {
    exercise: (
      <TextField
        key="exercise"
        label="Exercise"
        variant="standard"
        value={exercise?.name}
        slotProps={{
          input: { readOnly: true },
        }}
      />
    ),
    modifiers: (
      <ComboBoxField
        key="modifiers"
        label="Modifiers"
        options={activeModifiers}
        initialValue={activeModifiers}
        variant="standard"
        helperText=""
        readOnly
      />
    ),
    setType: (
      <SetTypeSelect
        key="setType"
        setType={setType}
        units={displayFields.units}
        totalReps={calculateTotalValue(sets, setType)}
        showRemaining
      />
    ),
    sets: (
      <RenderSets
        key="sets"
        {...{
          displayFields,
          showSplitWeight,
          sets,
          _id,
          extraWeight,
          exerciseWeight,
        }}
      />
    ),
  }

  return isQuickRender ? (
    <></>
  ) : (
    <Card elevation={0} {...cardProps}>
      <CardHeader
        title={
          <Link
            // todo: Could add the record number so swiper can directly link to the record.
            // May not be worth the effort tho.
            href={`/sessions/${date}`}
          >
            {date}
          </Link>
        }
        slotProps={{
          title: { variant: 'h6' },
        }}
        action={actions?.map((action) => actionComponents[action])}
      />
      <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

      {/* Note -- cannot override pb normally. See: https://stackoverflow.com/questions/54236623/cant-remove-padding-bottom-from-card-content-in-material-ui */}
      <CardContent sx={{ px: 1 }}>
        <Stack spacing={2}>
          {content?.map((item) => contentComponents[item])}
        </Stack>
      </CardContent>
    </Card>
  )
})
