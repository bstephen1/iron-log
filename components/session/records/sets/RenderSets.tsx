import { Box } from '@mui/material'
import useNoSwipingDesktop from '../../../../lib/frontend/useNoSwipingSmScreen'
import { UpdateFields } from '../../../../lib/util'
import Exercise from '../../../../models/AsyncSelectorOption/Exercise'
import { DisplayFields } from '../../../../models/DisplayFields'
import Record from '../../../../models/Record'
import AddSetButton from './AddSetButton'
import SetHeader from './SetHeader'
import RenderSetRow from './RenderSetRow'

interface Props extends Pick<Record, '_id' | 'sets'> {
  /** if omitted, sets are treated as readOnly */
  mutateExerciseFields?: UpdateFields<Exercise>
  /** displayFields must be given as a prop because history records use the parent's fields
   *  so they can reflect changes to the parent's display fields.
   */
  displayFields: DisplayFields
  showSplitWeight?: boolean
  showUnilateral?: boolean
  extraWeight: number
}
export default function RenderSets({
  mutateExerciseFields,
  displayFields,
  showSplitWeight,
  showUnilateral,
  sets,
  extraWeight,
  _id,
}: Props) {
  const readOnly = !mutateExerciseFields

  return (
    <Box>
      <SetHeader
        className={useNoSwipingDesktop()}
        {...{
          displayFields,
          mutateExerciseFields,
          readOnly,
          showSplitWeight,
          showUnilateral,
        }}
      />
      <Box>
        {sets.map((set, i) => (
          <RenderSetRow
            key={i}
            index={i}
            {...{ ...set, displayFields, readOnly, _id, extraWeight }}
          />
        ))}
      </Box>
      {!readOnly && (
        <AddSetButton
          disabled={!displayFields.visibleFields.length}
          {...{ sets, _id }}
        />
      )}
    </Box>
  )
}
