import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import { useEffect } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import useLocalStorageState from 'use-local-storage-state'
import type { PartialUpdate } from '../../../../lib/util'
import type { Exercise } from '../../../../models/AsyncSelectorOption/Exercise'
import type { DisplayFields } from '../../../../models/DisplayFields'
import type { Record } from '../../../../models/Record'
import ChangeUnitsButton from './ChangeUnitsButton'
import DeleteRecordButton from './DeleteRecordButton'
import ExerciseNotesButton from './ExerciseNotesButton'
import ManageExerciseButton from './ManageExerciseButton'
import MoreActionsButton from './MoreActionsButton'
import RecordNotesButton from './RecordNotesButton'
import SwapRecordButton from './SwapRecordButton'

const actionButtonWidth = 40
const minTitleWidth = 120

const actionsToWidth = (actions: number) =>
  actions * actionButtonWidth + minTitleWidth
const widthToActions = (width: number) =>
  Math.floor((width - minTitleWidth) / actionButtonWidth)

/** determines how many actions can visibly fit in the record header */
const useMaxVisibleActions = (totalActions: number) => {
  const [cardHeaderActions, setCardHeaderActions] = useLocalStorageState(
    'cardHeaderActions',
    {
      defaultValue: 0,
    }
  )

  // Width inits as undefined on mount since the ref needs a frame to setup.
  // By using local storage we can persist previous data between route changes,
  // preventing the undefined state when using the date picker to change sessions.
  const { ref, width = actionsToWidth(cardHeaderActions) } =
    useResizeDetector<HTMLSpanElement>()

  // max number of action buttons that will visibly fit in the header
  const maxVisibleActions = widthToActions(width)

  // limits actions to be no less than 0 and no more than total actions
  const maxBoundedActions = Math.max(
    Math.min(maxVisibleActions, totalActions),
    0
  )
  // don't hide an action if it would be the only hidden action
  const visibleActions =
    maxBoundedActions === totalActions - 1 ? totalActions : maxBoundedActions

  // Update local storage. Use visibleActions to limit setState calls.
  useEffect(() => {
    setCardHeaderActions(visibleActions)
  }, [setCardHeaderActions, visibleActions])

  return {
    /** must assign this ref to the record header element */
    ref,
    /** Denotes an index in the actions array. Items before this index (exclusive) can be visible.  */
    visibleActions,
  }
}

interface Props extends Pick<Record, 'notes' | 'sets' | '_id' | 'exercise'> {
  swiperIndex: number
  mutateExerciseFields: PartialUpdate<Exercise>
  mutateRecordFields: PartialUpdate<Record>
  displayFields: DisplayFields
  date: string
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
  date,
}: Props) {
  const actionButtons = [
    <RecordNotesButton
      key="record notes dialog"
      sides={sets.map((set) => set.side)}
      {...{ notes, mutateRecordFields, date }}
    />,
    <ExerciseNotesButton
      key="exercise notes dialog"
      disabled={!exercise}
      notes={exercise?.notes}
      modifiers={exercise?.modifiers}
      mutateExerciseFields={mutateExerciseFields}
    />,
    <ChangeUnitsButton
      key="change units dialog"
      {...{ mutateExerciseFields, displayFields }}
    />,
    <ManageExerciseButton key="manage" _id={exercise?._id} />,
    <SwapRecordButton key="left" direction="left" index={swiperIndex} />,
    <SwapRecordButton key="right" direction="right" index={swiperIndex} />,
    <DeleteRecordButton key="delete" _id={_id} />,
  ]

  const { ref, visibleActions } = useMaxVisibleActions(actionButtons.length)

  return (
    <CardHeader
      ref={ref}
      title={`Record ${swiperIndex + 1}`}
      slotProps={{
        title: { variant: 'h6' },
      }}
      action={
        <Box sx={{ cursor: 'default', width: '100%' }}>
          {actionButtons.slice(0, visibleActions)}
          <MoreActionsButton actions={actionButtons.slice(visibleActions)} />
        </Box>
      }
    />
  )
}
