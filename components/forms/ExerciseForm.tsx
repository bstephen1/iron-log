import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  addExercise,
  deleteExercise,
  updateExerciseFields,
} from '../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../lib/frontend/constants'
import {
  dbAdd,
  dbDelete,
  dbUpdate,
  useCategories,
  useExercises,
  useModifiers,
  useRecords,
} from '../../lib/frontend/restService'
import {
  createExercise,
  type Exercise,
} from '../../models/AsyncSelectorOption/Exercise'
import { type Note } from '../../models/Note'
import ActionItems from '../form-fields/actions/ActionItems'
import AttributeCheckboxes from '../form-fields/AttributeCheckboxes'
import ComboBoxField from '../form-fields/ComboBoxField'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import NameField from '../form-fields/NameField'
import NotesList from '../form-fields/NotesList'
import StatusSelectField from '../form-fields/StatusSelectField'

interface Props {
  exercise: Exercise
}
export default function ExerciseForm({ exercise }: Props) {
  const { _id, name, status, notes, attributes, weight } = exercise
  const modifiers = useModifiers()
  const categories = useCategories()
  const { data: records } = useRecords({ exercise: name })
  const exercises = useExercises()
  const [_, setUrlExercise] = useQueryState('exercise')

  // We need to avoid using "exercise" or this function will always trigger child rerenders,
  // so we isolate using it within the mutate callbacks.
  const updateFields = useCallback(
    async (updates: Partial<Exercise>) => {
      dbUpdate({
        updateFunction: updateExerciseFields,
        optimisticKey: [QUERY_KEYS.exercises],
        id: _id,
        updates,
      })
    },
    [_id]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setUrlExercise(null)
      dbDelete({
        deleteFunction: deleteExercise,
        optimisticKey: [QUERY_KEYS.exercises],
        id,
      })
    },
    [setUrlExercise]
  )

  const handleDuplicate = useCallback(async () => {
    const newName = exercise.name + ' (copy)'
    const newExercise = createExercise(newName, exercise)

    dbAdd({
      addFunction: addExercise,
      optimisticKey: [QUERY_KEYS.exercises],
      newItem: newExercise,
      errorMessage: `The exercise is corrupt and can't be duplicated.`,
      successMessage: `Duplicated as "${newName}"`,
    })
    setUrlExercise(newExercise._id)
  }, [exercise, setUrlExercise])

  return (
    <Grid container spacing={1} size={12}>
      <Grid size={12}>
        <NameField
          name={name}
          handleUpdate={updateFields}
          options={exercises.names}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <StatusSelectField status={status} handleUpdate={updateFields} />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <EquipmentWeightField weight={weight} handleUpdate={updateFields} />
      </Grid>
      <Grid size={12}>
        <ComboBoxField
          label="Categories"
          initialValue={exercise.categories}
          options={categories.names}
          handleSubmit={useCallback(
            (categories: string[]) => updateFields({ categories }),
            [updateFields]
          )}
        />
      </Grid>
      <Grid size={12}>
        <ComboBoxField
          label="Modifiers"
          initialValue={exercise.modifiers}
          options={modifiers.names}
          handleSubmit={useCallback(
            (modifiers: string[]) => updateFields({ modifiers }),
            [updateFields]
          )}
        />
      </Grid>
      <Grid size={12}>
        <AttributeCheckboxes
          attributes={attributes}
          handleSubmit={useCallback(
            (attributes) => updateFields({ attributes }),
            [updateFields]
          )}
        />
      </Grid>
      <Grid size={12}>
        <NotesList
          label="Notes"
          notes={notes}
          options={exercise.modifiers}
          handleSubmit={useCallback(
            (notes: Note[]) => updateFields({ notes }),
            [updateFields]
          )}
          multiple
        />
      </Grid>
      <Grid size={12}>
        <ActionItems
          id={_id}
          name={name}
          type="exercise"
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
          deleteDisabled={!!records?.length}
        />
      </Grid>
    </Grid>
  )
}
