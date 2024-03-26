import { AutocompleteChangeReason } from '@mui/material'
import {
  updateExerciseFields,
  useExercises,
} from '../../lib/frontend/restService'
import { ComboBoxField } from './ComboBoxField'

interface Props {
  field: 'categories' | 'modifiers'
  /** name of currently selected category / modifier */
  name: string
}
/** updates category / modifier usage in exercises.
 *  Ie, with a given category, add / remove it to exercises.
 */
export default function UsageComboBox({ field, name }: Props) {
  const { exercises, exerciseNames, mutate: mutateExercises } = useExercises()
  const usage =
    exercises
      ?.filter((exercise) => exercise[field].includes(name))
      .map((exercise) => exercise.name) ?? []

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
      initialValue={usage}
      options={exerciseNames}
      fullWidth
      handleChange={handleUpdateExercise}
      // cannot use "append" because options are recomputed from exercises on rerender
      changeBehavior="filter"
    />
  )
}
