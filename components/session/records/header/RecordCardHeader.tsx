import { Box, CardHeader } from '@mui/material'
import useNoSwipingSmScreen from 'lib/frontend/useNoSwipingSmScreen'
import { UpdateFields } from 'lib/util'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { DisplayFields } from 'models/DisplayFields'
import Record from 'models/Record'
import { useEffect, useState } from 'react'
import { useMeasure } from 'react-use'
import ChangeUnitsButton from './ChangeUnitsButton'
import DeleteRecordButton from './DeleteRecordButton'
import ExerciseNotesButton from './ExerciseNotesButton'
import ManageExerciseButton from './ManageExerciseButton'
import MoreActionsButton from './MoreActionsButton'
import RecordNotesButton from './ReccordNotesButton'
import SwapRecordButton from './SwapRecordButton'

const actionButtonWidth = 40
const minTitleWidth = 120

interface Props extends Pick<Record, 'notes' | 'sets' | '_id' | 'exercise'> {
  swiperIndex: number
  mutateExerciseFields: UpdateFields<Exercise>
  mutateRecordFields: UpdateFields<Record>
  displayFields: DisplayFields
}
export default function RecordCardHeader({
  swiperIndex,
  mutateExerciseFields,
  mutateRecordFields,
  notes,
  sets,
  _id,
  exercise,
  displayFields,
}: Props) {
  const noSwipingClassName = useNoSwipingSmScreen()
  // Note: visibleActions is defined after actionButtons
  const [titleRef, { width: titleWidth }] = useMeasure<HTMLSpanElement>()

  const maxVisibleActions = Math.floor(
    (titleWidth - minTitleWidth) / actionButtonWidth
  )

  // todo: width resets to 0 on date change due to component rerender, making this always flash to true

  const actionButtons = [
    <RecordNotesButton
      key="record notes"
      sides={sets.map((set) => set.side)}
      {...{ notes, mutateRecordFields }}
    />,
    <ExerciseNotesButton
      key="exercise notes"
      disabled={!exercise}
      notes={exercise?.notes}
      modifiers={exercise?.modifiers}
      mutateExerciseFields={mutateExerciseFields}
    />,
    <ChangeUnitsButton
      key="units"
      {...{ mutateExerciseFields, displayFields }}
    />,
    <ManageExerciseButton key="manage" name={exercise?.name} />,
    <SwapRecordButton key="left" direction="left" index={swiperIndex} />,
    <SwapRecordButton key="right" direction="right" index={swiperIndex} />,
    <DeleteRecordButton key="delete" _id={_id} />,
  ]

  const [visibleActions, setVisibleActions] = useState(actionButtons.length)

  // depending on maxVisibleActions instead of directly on titleWidth possibly is more performant
  useEffect(() => {
    // don't hide if there would only be one hidden action
    if (actionButtons.length - maxVisibleActions === 1) {
      setVisibleActions(actionButtons.length)
    } else {
      setVisibleActions(maxVisibleActions > 0 ? maxVisibleActions : 0)
    }
  }, [actionButtons.length, maxVisibleActions])

  return (
    <CardHeader
      ref={titleRef}
      title={`Record ${swiperIndex + 1}`}
      titleTypographyProps={{ variant: 'h6' }}
      action={
        <Box
          className={noSwipingClassName}
          sx={{ cursor: 'default', width: '100%' }}
        >
          {actionButtons.slice(0, visibleActions)}
          <MoreActionsButton {...{ actionButtons, visibleActions }} />
        </Box>
      }
    />
  )
}
