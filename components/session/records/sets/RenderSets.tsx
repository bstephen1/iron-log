import { Box } from '@mui/material'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { DisplayFields } from 'models/DisplayFields'
import Record from 'models/Record'
import { memo } from 'react'
import AddSetButton from './AddSetButton'
import SetHeader from './SetHeader'
import SetInput from './SetInput'

interface Props extends Pick<Record, '_id' | 'sets'> {
  /** if omitted, sets are treated as readOnly */
  mutateExerciseFields?: (changes: Partial<Exercise>) => Promise<void>
  /** displayFields must be given as a prop because history records use the parent's fields
   *  so they can reflect changes to the parent's display fields.
   */
  displayFields: DisplayFields
  showSplitWeight?: boolean
  showUnilateral?: boolean
  noSwipingClassName?: string
  extraWeight: number
}
export default memo(function RenderSets({
  mutateExerciseFields,
  displayFields,
  showSplitWeight,
  showUnilateral,
  noSwipingClassName,
  sets,
  extraWeight,
  _id,
}: Props) {
  const readOnly = !mutateExerciseFields

  return (
    <Box>
      <SetHeader
        className={noSwipingClassName}
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
          <SetInput
            key={i}
            index={i}
            {...{ set, displayFields, readOnly, _id, extraWeight }}
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
})
