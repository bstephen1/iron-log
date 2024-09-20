import Grid from '@mui/material/Unstable_Grid2'
import { useQueryState } from 'next-usequerystate'
import { useCallback } from 'react'
import {
  deleteExercise,
  updateExercise,
  useCategories,
  useExercises,
  useModifiers,
  useRecords,
} from '../../lib/frontend/restService'
import Exercise from '../../models/AsyncSelectorOption/Exercise'
import ActionItems from '../form-fields/actions/ActionItems'
import AttributeCheckboxes from '../form-fields/AttributeCheckboxes'
import ComboBoxField from '../form-fields/ComboBoxField'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import NameField from '../form-fields/NameField'
import NotesList from '../form-fields/NotesList'
import StatusSelectField from '../form-fields/StatusSelectField'

interface Props {
  exercise: Exercise
  handleUpdate: (id: string, updates: Partial<Exercise>) => void
}
export default function ExerciseForm({ exercise, handleUpdate }: Props) {
  const {
    _id,
    name,
    status,
    modifiers,
    notes,
    attributes,
    categories,
    weight,
  } = exercise
  const { modifierNames } = useModifiers()
  const { categoryNames } = useCategories()
  const { records } = useRecords({ exercise: name })
  const { exerciseNames, mutate: mutateExercises, exercises } = useExercises()
  const [_, setUrlExercise] = useQueryState('exercise')

  const updateFields = useCallback(
    (updates: Partial<Exercise>) => handleUpdate(_id, updates),
    [_id, handleUpdate],
  )
  // todo: validate (drop empty notes)

  const handleDelete = async () => {
    await deleteExercise(name)
    setUrlExercise(null)
    mutateExercises((cur) => cur?.filter((e) => e.name !== name))
  }

  const handleDuplicate = async () => {
    if (!exercises) return

    const newName = name + ' (copy)'
    const newExercise = new Exercise(newName, exercise)
    await updateExercise(newExercise)
    setUrlExercise(newName)
    mutateExercises([...exercises, newExercise])
  }

  return (
    <Grid container spacing={1} xs={12}>
      <Grid xs={12}>
        <NameField
          initialValue={name}
          handleUpdate={updateFields}
          options={exerciseNames}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <StatusSelectField initialValue={status} handleUpdate={updateFields} />
      </Grid>
      <Grid xs={12} sm={6}>
        <EquipmentWeightField
          initialValue={weight}
          handleUpdate={updateFields}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Categories"
          initialValue={categories}
          options={categoryNames}
          handleSubmit={(categories) => updateFields({ categories })}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Modifiers"
          initialValue={modifiers}
          options={modifierNames}
          handleSubmit={(modifiers) => updateFields({ modifiers })}
        />
      </Grid>
      <Grid xs={12}>
        <AttributeCheckboxes
          attributes={attributes}
          handleSubmit={(attributes) => updateFields({ attributes })}
        />
      </Grid>
      <Grid xs={12}>
        <NotesList
          label="Notes"
          notes={notes}
          options={modifiers}
          handleSubmit={(notes) => updateFields({ notes })}
          multiple
        />
      </Grid>
      <Grid xs={12}>
        <ActionItems
          name={name}
          type="exercise"
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
          deleteDisabled={records?.length}
        />
      </Grid>
    </Grid>
  )
}
