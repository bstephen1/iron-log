import { Box } from '@mui/material'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { DisplayFields } from 'models/DisplayFields'
import Record from 'models/Record'
import { memo } from 'react'
import AddSetButton from './AddSetButton'
import SetHeader from './SetHeader'
import SetInput from './SetInput'

interface Props extends Pick<Record, 'sets'> {
  /** if omitted, sets are treated as readOnly */
  mutateExerciseFields?: (changes: Partial<Exercise>) => Promise<void>
  /** displayFields must be given as a prop because history records use the parent's fields
   *  so they can reflect changes to the parent's display fields.
   */
  displayFields: DisplayFields
  /** Override internal showSplitWeight calculation. */
  showSplitWeight?: boolean
  noSwipingClassName?: string
}
export default memo(function RenderSets({
  mutateExerciseFields,
  displayFields,
  showSplitWeight,
  noSwipingClassName,
  sets,
}: Props) {
  const readOnly = !mutateExerciseFields

  return (
    <Box>
      <SetHeader
        className={noSwipingClassName}
        displayFields={displayFields}
        mutateExerciseFields={mutateExerciseFields}
        readOnly={readOnly}
        showSplitWeight={showSplitWeight}
      />
      <Box>
        {sets.map((set, i) => (
          <SetInput
            key={i}
            index={i}
            set={set}
            displayFields={displayFields}
            readOnly={readOnly}
          />
        ))}
      </Box>
      {!readOnly && <AddSetButton />}
    </Box>
  )
})
