import { AutocompleteChangeReason } from '@mui/material'
import {
  updateExerciseFields,
  useExercises,
} from '../../lib/frontend/restService'
import Exercise from '../../models/AsyncSelectorOption/Exercise'
import { ComboBoxField } from './ComboBoxField'

interface Props {
  field: 'categories' | 'modifiers'
  /** name of currently selected category / modifier */
  name: string
  /** list of exercises this field is used in */
  usage: Exercise[]
}
/** updates category / modifier usage in exercises.
 *  Ie, with a given category, add / remove it to exercises.
 */
export default function UsageComboBox({ field, name, usage }: Props) {
  const { exercises, exerciseNames, mutate: mutateExercises } = useExercises()
  const usageNames = usage.map((exercise) => exercise.name)

  const handleUpdateExercise = async (
    exerciseName: string | undefined,
    reason: AutocompleteChangeReason,
  ) => {
    const newExercise = exercises?.find(
      (exercise) => exercise.name === exerciseName,
    )
    if (!newExercise) return

    let updatedField = [...newExercise?.[field]]
    if (reason === 'selectOption') {
      updatedField = [...updatedField, name]
    } else if (reason === 'removeOption') {
      updatedField = updatedField.filter((itemName) => name !== itemName)
    }

    await updateExerciseFields(newExercise, { [field]: updatedField })
    mutateExercises()
  }

  return (
    <ComboBoxField
      label="Exercises"
      initialValue={usageNames}
      options={exerciseNames}
      fullWidth
      handleChange={handleUpdateExercise}
      // cannot use "append" because options are recomputed from exercises on rerender
      changeBehavior="filter"
    />
  )
}
