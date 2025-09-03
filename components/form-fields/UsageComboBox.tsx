import { type AutocompleteChangeReason } from '@mui/material/Autocomplete'
import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { updateExerciseFields } from '../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../lib/frontend/constants'
import { dbUpdate, useExercises } from '../../lib/frontend/restService'
import { type Exercise } from '../../models/AsyncSelectorOption/Exercise'
import ComboBoxField from './ComboBoxField'

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
export default memo(function UsageComboBox({ field, name, usage }: Props) {
  const exercises = useExercises()
  const usageNames = usage.map((exercise) => exercise.name)

  const handleUpdateExercise = async (
    exerciseName: string | undefined,
    reason: AutocompleteChangeReason
  ) => {
    const newExercise = exercises.data.find(
      (exercise) => exercise.name === exerciseName
    )
    if (!newExercise) return

    let updatedField = [...newExercise[field]]
    if (reason === 'selectOption') {
      updatedField = [...updatedField, name]
    } else if (reason === 'removeOption') {
      updatedField = updatedField.filter((itemName) => name !== itemName)
    }

    dbUpdate({
      updateFunction: updateExerciseFields,
      optimisticKey: [QUERY_KEYS.exercises],
      id: newExercise._id,
      updates: { [field]: updatedField },
    })
  }

  return (
    <ComboBoxField
      label="Exercises"
      initialValue={usageNames}
      options={exercises.names}
      fullWidth
      handleChange={handleUpdateExercise}
      disableClearable
      // cannot use "append" because options are recomputed from exercises on rerender
      changeBehavior="filter"
    />
  )
}, isEqual)
