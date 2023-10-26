import { Box } from '@mui/material'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { DisplayFields } from 'models/DisplayFields'
import useRecordCard from '../useRecordCard'
import AddSetButton from './AddSetButton'
import SetHeader from './SetHeader'
import SetInput from './SetInput'

interface Props {
  /** if omitted, sets are treated as readOnly */
  handleExerciseFieldsChange?: (changes: Partial<Exercise>) => Promise<void>
  /** displayFields must be given as a prop because history records use the parent's fields
   *  so they can reflect changes to the parent's display fields.
   */
  displayFields: DisplayFields
  /** Override internal showSplitWeight calculation. */
  showSplitWeight?: boolean
}
export default function RenderSets({
  handleExerciseFieldsChange,
  displayFields,
  showSplitWeight,
}: Props) {
  const { sets } = useRecordCard()
  const readOnly = !handleExerciseFieldsChange

  return (
    <Box>
      <SetHeader
        displayFields={displayFields}
        handleSubmit={(displayFields) =>
          handleExerciseFieldsChange?.({ displayFields })
        }
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
}
