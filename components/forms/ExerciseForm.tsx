import Grid from '@mui/material/Unstable_Grid2'
import { useQueryState } from 'next-usequerystate'
import { useCallback } from 'react'
import * as yup from 'yup'
import {
  deleteExercise,
  updateExercise,
  useCategories,
  useExercises,
  useModifiers,
  useRecords,
} from '../../lib/frontend/restService'
import Exercise from '../../models/AsyncSelectorOption/Exercise'
import AttributeCheckboxes from '../form-fields/AttributeCheckboxes'
import { ComboBoxField } from '../form-fields/ComboBoxField'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import InputField from '../form-fields/InputField'
import NotesList from '../form-fields/NotesList'
import StatusSelect from '../form-fields/StatusSelect'
import ActionItems from '../form-fields/actions/ActionItems'
import { buildYupSchema } from './yupSchemas'

export default function ExerciseForm({
  exercise,
  handleUpdate,
}: {
  exercise: Exercise
  handleUpdate: (id: string, updates: Partial<Exercise>) => void
}) {
  const { modifierNames } = useModifiers()
  const { categoryNames } = useCategories()
  const { records } = useRecords({ exercise: exercise.name })
  const { exerciseNames, mutate: mutateExercises, exercises } = useExercises()
  const [_, setUrlExercise] = useQueryState('exercise')

  const updateFields = useCallback(
    (updates: Partial<Exercise>) => handleUpdate(exercise._id, updates),
    [exercise._id, handleUpdate],
  )
  // todo: validate (drop empty notes)

  const validationSchema = buildYupSchema('name', 'exercise', exerciseNames)

  const handleDelete = async () => {
    await deleteExercise(exercise.name)
    setUrlExercise(null)
    mutateExercises((cur) => cur?.filter((e) => e.name !== exercise.name))
  }

  const handleDuplicate = async () => {
    if (!exercises) return

    const newName = exercise.name + ' (copy)'
    const newExercise = new Exercise(newName, exercise)
    await updateExercise(newExercise)
    setUrlExercise(newName)
    mutateExercises([...exercises, newExercise])
  }

  return (
    <Grid container spacing={1} xs={12}>
      <Grid xs={12}>
        {/* todo: would be great to consolidate this somehow. Maybe have a "name" for the inputFields.
            Export the schema and have the hook pull it in?  */}
        <InputField
          label="Name"
          initialValue={exercise.name}
          required
          fullWidth
          handleSubmit={(name) => updateFields({ name })}
          yupValidator={yup.reach(validationSchema, 'name')}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <StatusSelect
          initialValue={exercise.status}
          handleSubmit={(status) => updateFields({ status })}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <EquipmentWeightField
          initialValue={exercise.weight}
          handleUpdate={updateFields}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Categories"
          initialValue={exercise.categories}
          options={categoryNames}
          textFieldProps={{ helperText: ' ' }}
          handleSubmit={(categories) => updateFields({ categories })}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Modifiers"
          initialValue={exercise.modifiers}
          options={modifierNames}
          textFieldProps={{ helperText: ' ' }}
          handleSubmit={(modifiers) => updateFields({ modifiers })}
        />
      </Grid>
      <Grid xs={12}>
        <AttributeCheckboxes
          attributes={exercise.attributes}
          handleSubmit={(attributes) => updateFields({ attributes })}
        />
      </Grid>
      <Grid xs={12}>
        <NotesList
          label="Notes"
          notes={exercise.notes}
          options={exercise.modifiers}
          handleSubmit={(notes) => updateFields({ notes })}
          multiple
        />
      </Grid>
      <Grid xs={12}>
        <ActionItems
          name={exercise.name}
          type="exercise"
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
          deleteDisabled={records?.length}
        />
      </Grid>
    </Grid>
  )
}
